CREATE DATABASE IF NOT EXISTS tutorial_sql
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tutorial_sql;

DROP TABLE IF EXISTS post;
DROP TABLE IF EXISTS utilizador;
DROP TABLE IF EXISTS pais;

CREATE TABLE pais (
  pais_id INT PRIMARY KEY,
  nome VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE utilizador (
  utilizador_id INT PRIMARY KEY,
  nome VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  pais_id INT NULL,
  estado ENUM('ativo','inativo') NOT NULL DEFAULT 'ativo',
  reputacao INT NOT NULL DEFAULT 0,
  data_registo DATE NOT NULL,
  FOREIGN KEY (pais_id) REFERENCES pais(pais_id)
) ENGINE=InnoDB;

CREATE TABLE post (
  post_id INT PRIMARY KEY,
  utilizador_id INT NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  publicado_em DATETIME NOT NULL,
  gostos INT NOT NULL DEFAULT 0,
  FOREIGN KEY (utilizador_id) REFERENCES utilizador(utilizador_id)
) ENGINE=InnoDB;

INSERT INTO pais VALUES
  (1,'Portugal'), (2,'Brasil'), (3,'Espanha'), (4,'Angola');

INSERT INTO utilizador VALUES
  (101,'Ana Costa','ana@example.test',1,'ativo',82,'2026-01-12'),
  (102,'Bruno Lima','bruno@example.test',2,'ativo',57,'2026-01-18'),
  (103,'Carla Sousa','carla@example.test',1,'inativo',91,'2026-02-03'),
  (104,'Diogo Martins','diogo@example.test',3,'ativo',38,'2026-02-08'),
  (105,'Eva Rocha','eva@example.test',NULL,'ativo',57,'2026-03-01'),
  (106,'Fábio Alves','fabio@example.test',2,'ativo',74,'2026-03-10');

INSERT INTO post VALUES
  (1001,101,'Primeiros passos em SQL','2026-03-02 10:30:00',12),
  (1002,101,'Chaves estrangeiras','2026-03-06 15:10:00',8),
  (1003,102,'Docker e MySQL','2026-03-07 09:20:00',21),
  (1004,103,'Como desenhar tabelas','2026-03-09 18:00:00',15),
  (1005,106,'Consultas com GROUP BY','2026-03-12 11:45:00',26);

