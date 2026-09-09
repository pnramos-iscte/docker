USE tutorial_sql;

CREATE OR REPLACE VIEW vw_utilizador_pais AS
SELECT u.utilizador_id, u.nome, u.estado, p.nome AS pais
FROM utilizador AS u
LEFT JOIN pais AS p ON p.pais_id = u.pais_id;

SELECT * FROM vw_utilizador_pais;

CREATE OR REPLACE VIEW vw_estatisticas_autor AS
SELECT u.utilizador_id,
       u.nome,
       COUNT(p.post_id) AS total_posts,
       COALESCE(SUM(p.gostos), 0) AS total_gostos,
       COALESCE(AVG(p.gostos), 0) AS media_gostos
FROM utilizador AS u
LEFT JOIN post AS p ON p.utilizador_id = u.utilizador_id
GROUP BY u.utilizador_id, u.nome;

SELECT *
FROM vw_estatisticas_autor
ORDER BY total_gostos DESC;

CREATE OR REPLACE VIEW vw_autores_relevantes AS
SELECT utilizador_id, nome, total_posts, total_gostos
FROM vw_estatisticas_autor
WHERE total_posts >= 2 OR total_gostos >= 20;

SELECT * FROM vw_autores_relevantes;

CREATE OR REPLACE VIEW vw_utilizadores_ativos AS
SELECT utilizador_id, nome, email, pais_id, estado, reputacao
FROM utilizador
WHERE estado = 'ativo'
WITH CHECK OPTION;

UPDATE vw_utilizadores_ativos
SET reputacao = 60
WHERE utilizador_id = 102;

-- Esta alteração é recusada por WITH CHECK OPTION:
-- UPDATE vw_utilizadores_ativos
-- SET estado = 'inativo'
-- WHERE utilizador_id = 102;

SHOW CREATE VIEW vw_utilizador_pais;
