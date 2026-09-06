USE escola;

INSERT INTO aluno (numero, nome, curso, email) VALUES
  (100006, 'Filipe Sousa', 'LEI', 'filipe.sousa@example.test'),
  (100007, 'Gabriela Rocha', 'LIGE', 'gabriela.rocha@example.test')
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  curso = VALUES(curso),
  email = VALUES(email);
