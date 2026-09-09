USE tutorial_sql;

START TRANSACTION;

INSERT INTO pais (pais_id, nome)
VALUES (5, 'Cabo Verde');

INSERT INTO pais (pais_id, nome)
VALUES (6, 'França'), (7, 'Itália'), (8, 'Alemanha');

CREATE TABLE IF NOT EXISTS autores_destaque (
  utilizador_id INT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  total_gostos INT NOT NULL
);

INSERT INTO autores_destaque (utilizador_id, nome, total_gostos)
SELECT u.utilizador_id, u.nome, SUM(p.gostos)
FROM utilizador AS u
JOIN post AS p ON p.utilizador_id = u.utilizador_id
GROUP BY u.utilizador_id, u.nome
HAVING SUM(p.gostos) >= 20;

SELECT utilizador_id, nome, reputacao
FROM utilizador
WHERE estado = 'ativo' AND reputacao < 60;

UPDATE utilizador
SET reputacao = reputacao + 5
WHERE estado = 'ativo' AND reputacao < 60;

SELECT ROW_COUNT() AS linhas_alteradas;

-- Os exemplos ficam desfeitos para poder voltar a executar o ficheiro.
ROLLBACK;
