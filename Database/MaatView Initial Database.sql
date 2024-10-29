CREATE DATABASE maatview;

USE maatview;


-- Criar a tabela de Usuários com CPF
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    cargo ENUM('Admin', 'Líder', 'Liderado') NOT NULL,
    sub_cargo ENUM('Admin', 'Líder', 'Liderado'),
    lider_id INT,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    FOREIGN KEY (lider_id) REFERENCES Users(id)
);

-- Criar a tabela de Pesquisas
CREATE TABLE Pesquisas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(50) NOT NULL,
    sobre VARCHAR(255) NOT NULL,
    cat_pes ENUM('Auto Avaliação', 'Avaliação de Liderado', 'Avaliação de Líder') NOT NULL
);

-- Criar a tabela de Categorias de Perguntas
CREATE TABLE Categoria_Perguntas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    categoria VARCHAR(50) NOT NULL
);

-- Criar a tabela de Perguntas
CREATE TABLE Perguntas (
    id INT PRIMARY KEY AUTO_INCREMENT,
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



-- Inserir 15 Líderes
INSERT INTO Users (nome, email, senha, cargo, lider_id, cpf) VALUES 
('Líder 1', 'lider1@email.com', '$2a$10$H3wOxjpAFNHXtx5yqX.zUuRzNpzjdVIV4j8Eu4.JTGkaO/CGOYzzm', 'Líder', NULL, '111.111.111-11'),
('Líder 2', 'lider2@email.com', '$2a$10$H3wOxjpAFNHXtx5yqX.zUuRzNpzjdVIV4j8Eu4.JTGkaO/CGOYzzm', 'Líder', NULL, '222.222.222-22'),
('Líder 3', 'lider3@email.com', '$2a$10$H3wOxjpAFNHXtx5yqX.zUuRzNpzjdVIV4j8Eu4.JTGkaO/CGOYzzm', 'Líder', NULL, '333.333.333-33');

-- Inserir um Liderado
INSERT INTO Users (nome, email, senha, cargo, lider_id, cpf)
VALUES ('Liderado User', 'liderado@email.com', '$2a$10$I1QNViM5N1c8d3ro6uD4F.MaxZ0FBy59Ye1bjrs1TNtkA/1orKYIa', 'Liderado', 3, '009.876.543-21');

SELECT categoria FROM Categoria_Perguntas WHERE categoria LIKE 'sa';
select * from Categoria_Perguntas;
select * from Perguntas;

select * from Users;

select * from Pesquisas;

SELECT id, nome, email, cargo, sub_cargo, cpf FROM Users;

SELECT id, nome, email, cargo, COALESCE(sub_cargo, '') as sub_cargo, cpf FROM Users;


