#!/usr/bin/env bash
set -e

wait_for_mongo() {
  local host="$1"
  local port="$2"
  until mongosh --quiet --host "$host" --port "$port" --eval "db.adminCommand('ping').ok" | grep -q 1; do
    echo "À espera de ${host}:${port}..."
    sleep 2
  done
}

wait_for_mongo config1 27019
wait_for_mongo shard1a 27018
wait_for_mongo shard2a 27018

mongosh --quiet --host config1 --port 27019 <<'EOF'
try { rs.status(); } catch (error) {
  rs.initiate({
    _id: 'configRS',
    configsvr: true,
    members: [
      { _id: 0, host: 'config1:27019' },
      { _id: 1, host: 'config2:27019' },
      { _id: 2, host: 'config3:27019' }
    ]
  });
}
EOF

mongosh --quiet --host shard1a --port 27018 <<'EOF'
try { rs.status(); } catch (error) {
  rs.initiate({
    _id: 'shard1RS',
    members: [
      { _id: 0, host: 'shard1a:27018', priority: 2 },
      { _id: 1, host: 'shard1b:27018' },
      { _id: 2, host: 'shard1c:27018' }
    ]
  });
}
EOF

mongosh --quiet --host shard2a --port 27018 <<'EOF'
try { rs.status(); } catch (error) {
  rs.initiate({
    _id: 'shard2RS',
    members: [
      { _id: 0, host: 'shard2a:27018', priority: 2 },
      { _id: 1, host: 'shard2b:27018' },
      { _id: 2, host: 'shard2c:27018' }
    ]
  });
}
EOF

echo "À espera das eleições dos replica sets..."
sleep 12

until mongosh --quiet --host mongos --port 27017 --eval "db.adminCommand('ping').ok" | grep -q 1; do
  echo "À espera do router mongos..."
  sleep 2
done

mongosh --quiet --host mongos --port 27017 <<'EOF'
function ignoreAlreadyExists(action) {
  try { action(); } catch (error) {
    if (error.codeName !== 'AlreadyInitialized' &&
        error.codeName !== 'NamespaceExists' &&
        error.code !== 23 && error.code !== 20) {
      print(error);
    }
  }
}

ignoreAlreadyExists(() => sh.addShard('shard1RS/shard1a:27018,shard1b:27018,shard1c:27018'));
ignoreAlreadyExists(() => sh.addShard('shard2RS/shard2a:27018,shard2b:27018,shard2c:27018'));

sh.enableSharding('school_sharded');

ignoreAlreadyExists(() => sh.addShardToZone('shard1RS', 'zone1'));
ignoreAlreadyExists(() => sh.addShardToZone('shard2RS', 'zone2'));

function shardCollectionInZone(collectionName, zoneName) {
  const namespace = 'school_sharded.' + collectionName;
  const collection = db.getSiblingDB('school_sharded').getCollection(collectionName);

  collection.createIndex({ shard_key: 1 });
  ignoreAlreadyExists(() => sh.shardCollection(namespace, { shard_key: 1 }));
  ignoreAlreadyExists(() => sh.updateZoneKeyRange(
    namespace,
    { shard_key: MinKey },
    { shard_key: MaxKey },
    zoneName
  ));
}

// As duas primeiras coleções ficam cada uma num único shard.
shardCollectionInZone('collection_one', 'zone1');
shardCollectionInZone('collection_two', 'zone2');

// A terceira coleção é repartida pelo valor do campo "campus".
const thirdNamespace = 'school_sharded.collection_three';
const thirdCollection = db.getSiblingDB('school_sharded').collection_three;
thirdCollection.createIndex({ campus: 1, shard_key: 1 });
ignoreAlreadyExists(() => sh.shardCollection(
  thirdNamespace,
  { campus: 1, shard_key: 1 }
));
ignoreAlreadyExists(() => sh.updateZoneKeyRange(
  thirdNamespace,
  { campus: MinKey, shard_key: MinKey },
  { campus: 'sul', shard_key: MinKey },
  'zone1'
));
ignoreAlreadyExists(() => sh.updateZoneKeyRange(
  thirdNamespace,
  { campus: 'sul', shard_key: MinKey },
  { campus: MaxKey, shard_key: MaxKey },
  'zone2'
));

// Cria imediatamente os chunks e coloca-os no shard certo. Assim, o aluno não
// precisa de esperar por uma passagem posterior do balanceador.
try { sh.splitAt(thirdNamespace, { campus: 'sul', shard_key: MinKey }); } catch (error) {
  print('O ponto de divisão da collection_three já existe.');
}
sh.moveChunk(
  'school_sharded.collection_one',
  { shard_key: 0 },
  'shard1RS'
);
sh.moveChunk(
  'school_sharded.collection_two',
  { shard_key: 0 },
  'shard2RS'
);
sh.moveChunk(
  thirdNamespace,
  { campus: 'norte', shard_key: 0 },
  'shard1RS'
);
sh.moveChunk(
  thirdNamespace,
  { campus: 'sul', shard_key: 0 },
  'shard2RS'
);

print('Cluster com sharding configurado.');
EOF
