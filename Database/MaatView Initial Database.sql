CREATE DATABASE maatview;

USE maatview;

-- Criar a tabela de Usuários com CPF
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cargo ENUM('Admin', 'Líder', 'Liderado') NOT NULL,
    lider_id INT,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    FOREIGN KEY (lider_id) REFERENCES Users(id)
);

-- Criar a tabela de Pesquisas
CREATE TABLE Pesquisas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    sobre VARCHAR(255) NOT NULL,
    cat_pes VARCHAR(30) UNIQUE NOT NULL,
    alvo_cargo ENUM('Auto Avaliação', 'Avaliação de Liderado', 'Avaliação de Líder') NOT NULL
);

-- Criar a tabela de Categorias de Perguntas
CREATE TABLE Categoria_Perguntas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    categoria VARCHAR(50) NOT NULL
);

-- Criar a tabela de Perguntas
CREATE TABLE Perguntas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    sobre VARCHAR(255) NOT NULL,
    formato ENUM('Texto Longo', 'Escolha Única', 'Múltipla Escolha') NOT NULL,
    cat_id INT,
    FOREIGN KEY (cat_id) REFERENCES Categoria_Perguntas(id)
);

-- Criar a tabela de Pesquisas_Perguntas
CREATE TABLE Pesquisas_Perguntas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pes_id INT,
    per_id INT,
    FOREIGN KEY (pes_id) REFERENCES Pesquisas(id),
    FOREIGN KEY (per_id) REFERENCES Perguntas(id)
);

-- Criar a tabela de Opções
CREATE TABLE Opções (
    id INT AUTO_INCREMENT PRIMARY KEY,
    per_id INT,
    pes_id INT,
    texto VARCHAR(100) NOT NULL,
    FOREIGN KEY (pes_id) REFERENCES Pesquisas(id),
    FOREIGN KEY (per_id) REFERENCES Perguntas(id)
);

-- Criar a tabela de Respostas
CREATE TABLE Respostas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    per_id INT,
    pes_id INT,
    resp_texto VARCHAR(255),
    select_option_id INT,
    FOREIGN KEY (pes_id) REFERENCES Pesquisas(id),
    FOREIGN KEY (per_id) REFERENCES Perguntas(id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (select_option_id) REFERENCES Opções(id)
);

-- Inserir um Admin
INSERT INTO Users (nome, email, senha, cargo, lider_id, cpf)
VALUES ('Admin User', 'admin@email.com', '$2a$10$ddNpc6kVtPXVtsrnxYoTp.6mzgEuKGTS4PdoRdtuY7vJea/2TJlyu', 'Admin', NULL, '123.456.789-00');


-- Inserir um Liderado
INSERT INTO Users (nome, email, senha, cargo, lider_id, cpf)
VALUES ('Liderado User', 'liderado@email.com', '$2a$10$I1QNViM5N1c8d3ro6uD4F.MaxZ0FBy59Ye1bjrs1TNtkA/1orKYIa', 'Liderado', NULL, '009.876.543-21');

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
