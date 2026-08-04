#!/usr/bin/env bash
set -e

until mongosh --quiet --host mongo1 --eval "db.adminCommand('ping').ok" | grep -q 1; do
  echo "À espera do primeiro servidor MongoDB..."
  sleep 2
done

mongosh --quiet --host mongo1 <<'EOF'
try {
  rs.status();
  print('Replica set rs0 já estava configurado.');
} catch (error) {
  rs.initiate({
    _id: 'rs0',
    members: [
      { _id: 0, host: 'mongo1:27017', priority: 2 },
      { _id: 1, host: 'mongo2:27017', priority: 1 },
      { _id: 2, host: 'mongo3:27017', priority: 1 }
    ]
  });
  print('Replica set rs0 iniciado.');
}
EOF

