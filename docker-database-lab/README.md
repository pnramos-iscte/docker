# Laboratório Docker: MySQL, PHP, Python e MongoDB

Este pacote contém dois ambientes de aprendizagem compatíveis com Docker Desktop no Windows e no macOS:

1. `replica-set/`: MySQL, phpMyAdmin, PHP, Python e MongoDB com um replica set de três membros, sem sharding.
2. `sharded/`: os mesmos serviços, mais MongoDB com dois shards. Cada shard tem três réplicas e os config servers também formam um replica set de três membros. O exemplo fixa `collection_one` no primeiro shard e `collection_two` no segundo. A `collection_three` usa o campo `campus`: `norte` vai para o primeiro shard e `sul` para o segundo, sem duplicar documentos.

O tutorial completo está em `tutorial/index.html` e também é servido em `http://localhost:8080` quando qualquer ambiente está ativo.

## Arranque rápido pelo terminal

Abra o PowerShell no Windows ou o Terminal no macOS. Entre na pasta do cenário e execute `docker compose up -d --build`. O tutorial explica cada comando e inclui um guião prático de aula.

## Exemplos pela linha de comandos

Dentro de `replica-set/`:

```text
docker compose exec python python /workspace/mysql_example.py
docker compose exec python python /workspace/mongo/mongo_replica_example.py
```

Dentro de `sharded/`:

```text
docker compose exec python python /workspace/mysql_example.py
docker compose exec python python /workspace/mongo/mongo_sharding_example.py
```

## Dados persistentes

`docker compose down` para os contentores, mas conserva os dados. Para apagar também os volumes e recomeçar do zero, use `docker compose down -v`. Esta segunda operação elimina os dados do laboratório.

## Nota de segurança

As credenciais são deliberadamente simples e o MongoDB não usa autenticação, para reduzir a complexidade em sala de aula. As portas estão ligadas apenas a `127.0.0.1`. Não use esta configuração em produção nem a exponha à Internet.
