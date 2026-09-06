delete from MEMBROSGRUPO;
delete from grupo;
delete from post;
delete from utilizador;

insert into utilizador values ('luis@iscte.pt', 'Luís Novas','Portugal',1 );
insert into utilizador values ('ana@iscte.pt', 'Ana Patrício','Portugal',2 );
insert into utilizador values ('carlos@iscte.pt', 'Carlos Monteiro','Brasil',3 );
insert into utilizador values ('isabel@iscte.pt', 'Isabel Fonseca','Angola',4 );
insert into utilizador values ('monica@iscte.pt', 'Mónica Martins','Portugal',5 );
insert into utilizador values ('pedro@iscte.pt', 'Pedro Cortêz','Portugal',6 );
insert into utilizador values ('paulo@iscte.pt', 'Paulo Vicente','Portugal',7 );
insert into utilizador values ('vera@iscte.pt', 'Vera Nogueira','Brasil',8 );
insert into utilizador values ('filipa@iscte.pt', 'Filipa Andrade','Portugal',9 );
insert into utilizador values ('jose@iscte.pt', 'José Raimundo','Portugal',10 );


insert into post values (1,1,'Amanhã ninguém pode faltar à festa da Vera!!',now());
insert into post values (2,10,'Os Linking Park ontem no Rock-In-Rio foram fantásticos.',now());

insert into grupo values(1,'Alunos 2º Ano ISTA',now());
insert into grupo values(2,'Fustsal ISCTE',now());
insert into MEMBROSGRUPO values (1,1,1);
insert into MEMBROSGRUPO values (1,2,0);
insert into MEMBROSGRUPO values (2,1,1);



