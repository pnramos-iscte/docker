CREATE DATABASE IF NOT EXISTS school
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE school;

CREATE TABLE IF NOT EXISTS students (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    course VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

INSERT INTO students (name, course)
SELECT 'Aluno inicial', 'Informática'
WHERE NOT EXISTS (
    SELECT 1 FROM students WHERE name = 'Aluno inicial'
);

