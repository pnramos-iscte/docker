# MysqlDocker

Ambiente local de aprendizagem com MySQL 8.4 e phpMyAdmin 5.2.

Abra `index.html` no browser para consultar o guião completo.

## Arranque rápido

1. Instale e abra o Docker Desktop.
2. Copie `.env.example` para `.env`.
3. Abra PowerShell ou Terminal dentro desta pasta.
4. Execute `docker compose -f MysqlDocker.yml up -d`.
5. Abra `http://localhost:8081`.

## Parar sem apagar os dados

Execute `docker compose -f MysqlDocker.yml down`.

O comando `down -v` apaga o volume e todos os dados. Use-o apenas quando quiser recomeçar do zero.

## Executar o script de exemplo

A partir do PowerShell ou Terminal:

```bash
docker compose -f MysqlDocker.yml exec mysql sh -c 'mysql -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < /exemplos/mais_alunos.sql'
```

As três variáveis recebem automaticamente os valores do ficheiro `.env`.

Se já estiver dentro do cliente MySQL e vir `mysql>`, execute:

```sql
USE escola;
SOURCE /exemplos/mais_alunos.sql;
```
