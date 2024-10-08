create database maatview;

use maatview;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cargo ENUM('Admin', 'Líder', 'Liderado') NOT NULL,
    lider_id INT,  
    FOREIGN KEY (lider_id) REFERENCES Users(id)
);

create table Pesquisas (
	id int PRIMARY KEY auto_increment,
	titulo VARCHAR (50) NOT NULL ,
	sobre VARCHAR(255) NOT NULL ,
    cat_pes varchar(30)UNIQUE NOT NULL,
    alvo_cargo enum('Auto Avaliação','Avaliação de Liderado', 'Avaliação de Líder') not null
    );
    
    
create table Categoria_Perguntas(
	id int PRIMARY KEY auto_increment,
    categoria varchar(50)
);
create table Perguntas (
	id int PRIMARY KEY auto_increment,
	titulo VARCHAR (50) NOT NULL ,
	sobre VARCHAR(255) NOT NULL ,
    formato enum('Texto Longo', 'Escolha Única', 'Múltipla Escolha'),
    cat_id int,
    foreign key (cat_id) references  Categoria_Perguntas(id)
    );
    
create table Pesquisas_Perguntas(
	id  int PRIMARY KEY auto_increment,
    pes_id int,
    per_id int,
    foreign key(pes_id) references Pesquisas(id),
    foreign key(per_id) references Perguntas(id)
    );
    create table Opções (
	id int auto_increment PRIMARY KEY,
    per_id int,
    pes_id int,
    texto varchar(100) not null,
	foreign key(pes_id) references Pesquisas(id),
    foreign key(per_id) references Perguntas(id)
    );
create table Respostas (
	id int auto_increment PRIMARY KEY,
    user_id int,
    per_id int,
    pes_id int,
    resp_texto VARCHAR(255),
    select_option_id int,
	foreign key(pes_id) references Pesquisas(id),
    foreign key(per_id) references Perguntas(id),
    foreign key(user_id) references Users(id),
    foreign key(select_option_id) references Opções(id)
);





-- Inserir um Admin
INSERT INTO Users (nome, email, senha, cargo, lider_id)
VALUES ('Admin User', 'admin@email.com', 'admin123', 'Admin', NULL);

-- Inserir um Liderado
INSERT INTO Users (nome, email, senha, cargo, lider_id)
VALUES ('Liderado User', 'liderado@email.com', 'liderado123', 'Liderado', NULL);

-- Criar a pesquisa
INSERT INTO Pesquisas (titulo, sobre, cat_pes, alvo_cargo)
VALUES ('Pesquisa de Clima e Cultura', 'Avaliação do clima organizacional e liderança', 'Clima', 'Auto Avaliação');

-- Inserir categorias de perguntas
INSERT INTO Categoria_Perguntas (categoria) VALUES ('Desempenho'), ('Satisfação'), ('Desenvolvimento');

-- Pergunta 1: Texto Longo
INSERT INTO Perguntas (titulo, sobre, formato, cat_id)
VALUES ('Avaliação Geral', 'Descreva como você se sente em relação ao seu trabalho.', 'Texto Longo', 
        (SELECT id FROM Categoria_Perguntas WHERE categoria = 'Desempenho'));

-- Pergunta 2: Escolha Única
INSERT INTO Perguntas (titulo, sobre, formato, cat_id)
VALUES ('Satisfação com o Ambiente', 'Escolha o nível de satisfação com o ambiente de trabalho.', 'Escolha Única', 
        (SELECT id FROM Categoria_Perguntas WHERE categoria = 'Satisfação'));

-- Pergunta 3: Múltipla Escolha
INSERT INTO Perguntas (titulo, sobre, formato, cat_id)
VALUES ('Áreas de Desenvolvimento', 'Escolha as áreas em que gostaria de se desenvolver.', 'Múltipla Escolha', 
        (SELECT id FROM Categoria_Perguntas WHERE categoria = 'Desenvolvimento'));

-- Associe as perguntas à pesquisa
INSERT INTO Pesquisas_Perguntas (pes_id, per_id)
VALUES 
((SELECT id FROM Pesquisas WHERE titulo = 'Pesquisa de Clima e Cultura'), (SELECT id FROM Perguntas WHERE titulo = 'Avaliação Geral')),
((SELECT id FROM Pesquisas WHERE titulo = 'Pesquisa de Clima e Cultura'), (SELECT id FROM Perguntas WHERE titulo = 'Satisfação com o Ambiente')),
((SELECT id FROM Pesquisas WHERE titulo = 'Pesquisa de Clima e Cultura'), (SELECT id FROM Perguntas WHERE titulo = 'Áreas de Desenvolvimento'));

-- Opções para a pergunta de Escolha Única
INSERT INTO Opções (per_id, pes_id, texto)
VALUES 
((SELECT id FROM Perguntas WHERE titulo = 'Satisfação com o Ambiente'), (SELECT id FROM Pesquisas WHERE titulo = 'Pesquisa de Clima e Cultura'), 'Muito Satisfeito'),
((SELECT id FROM Perguntas WHERE titulo = 'Satisfação com o Ambiente'), (SELECT id FROM Pesquisas WHERE titulo = 'Pesquisa de Clima e Cultura'), 'Satisfeito'),
((SELECT id FROM Perguntas WHERE titulo = 'Satisfação com o Ambiente'), (SELECT id FROM Pesquisas WHERE titulo = 'Pesquisa de Clima e Cultura'), 'Indiferente'),
((SELECT id FROM Perguntas WHERE titulo = 'Satisfação com o Ambiente'), (SELECT id FROM Pesquisas WHERE titulo = 'Pesquisa de Clima e Cultura'), 'Insatisfeito'),
((SELECT id FROM Perguntas WHERE titulo = 'Satisfação com o Ambiente'), (SELECT id FROM Pesquisas WHERE titulo = 'Pesquisa de Clima e Cultura'), 'Muito Insatisfeito');

-- Opções para a pergunta de Múltipla Escolha
INSERT INTO Opções (per_id, pes_id, texto)
VALUES 
((SELECT id FROM Perguntas WHERE titulo = 'Áreas de Desenvolvimento'), (SELECT id FROM Pesquisas WHERE titulo = 'Pesquisa de Clima e Cultura'), 'Comunicação'),
((SELECT id FROM Perguntas WHERE titulo = 'Áreas de Desenvolvimento'), (SELECT id FROM Pesquisas WHERE titulo = 'Pesquisa de Clima e Cultura'), 'Liderança'),
((SELECT id FROM Perguntas WHERE titulo = 'Áreas de Desenvolvimento'), (SELECT id FROM Pesquisas WHERE titulo = 'Pesquisa de Clima e Cultura'), 'Gestão de Tempo'),
((SELECT id FROM Perguntas WHERE titulo = 'Áreas de Desenvolvimento'), (SELECT id FROM Pesquisas WHERE titulo = 'Pesquisa de Clima e Cultura'), 'Trabalho em Equipe'),
((SELECT id FROM Perguntas WHERE titulo = 'Áreas de Desenvolvimento'), (SELECT id FROM Pesquisas WHERE titulo = 'Pesquisa de Clima e Cultura'), 'Inovação');

-- Resposta para Texto Longo
INSERT INTO Respostas (user_id, per_id, pes_id, resp_texto)
VALUES 
((SELECT id FROM Users WHERE nome = 'Liderado User'), 
 (SELECT id FROM Perguntas WHERE titulo = 'Avaliação Geral'),
 (SELECT id FROM Pesquisas WHERE titulo = 'Pesquisa de Clima e Cultura'),
 'Estou satisfeito com o progresso, mas há pontos que podem ser melhorados.');

-- Resposta para Escolha Única
INSERT INTO Respostas (user_id, per_id, pes_id, select_option_id)
VALUES 
((SELECT id FROM Users WHERE nome = 'Liderado User'), 
 (SELECT id FROM Perguntas WHERE titulo = 'Satisfação com o Ambiente'),
 (SELECT id FROM Pesquisas WHERE titulo = 'Pesquisa de Clima e Cultura'),
 (SELECT id FROM Opções WHERE texto = 'Satisfeito'));

-- Resposta para Múltipla Escolha
INSERT INTO Respostas (user_id, per_id, pes_id, select_option_id)
VALUES 
((SELECT id FROM Users WHERE nome = 'Liderado User'), 
 (SELECT id FROM Perguntas WHERE titulo = 'Áreas de Desenvolvimento'),
 (SELECT id FROM Pesquisas WHERE titulo = 'Pesquisa de Clima e Cultura'),
 (SELECT id FROM Opções WHERE texto = 'Comunicação')),

((SELECT id FROM Users WHERE nome = 'Liderado User'), 
 (SELECT id FROM Perguntas WHERE titulo = 'Áreas de Desenvolvimento'),
 (SELECT id FROM Pesquisas WHERE titulo = 'Pesquisa de Clima e Cultura'),
 (SELECT id FROM Opções WHERE texto = 'Trabalho em Equipe'));

select * from Respostas;
