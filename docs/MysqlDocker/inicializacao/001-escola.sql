CREATE DATABASE IF NOT EXISTS escola
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE escola;

CREATE TABLE IF NOT EXISTS aluno (
  numero INT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  curso VARCHAR(40) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE
);

INSERT IGNORE INTO aluno (numero, nome, curso, email) VALUES
  (100001, 'Ana Silva', 'LEI', 'ana.silva@example.test'),
  (100002, 'Bruno Costa', 'LIGE', 'bruno.costa@example.test');
