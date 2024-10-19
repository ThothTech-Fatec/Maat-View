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


-- Inserir um Liderado
INSERT INTO Users (nome, email, senha, cargo, lider_id, cpf)
VALUES ('Liderado User', 'liderado@email.com', '$2a$10$I1QNViM5N1c8d3ro6uD4F.MaxZ0FBy59Ye1bjrs1TNtkA/1orKYIa', 'Liderado', NULL, '009.876.543-21');

-- Inserir 15 Líderes
INSERT INTO Users (nome, email, senha, cargo, lider_id, cpf) VALUES 
('Líder 1', 'lider1@email.com', '$2a$10$H3wOxjpAFNHXtx5yqX.zUuRzNpzjdVIV4j8Eu4.JTGkaO/CGOYzzm', 'Líder', NULL, '111.111.111-11'),
('Líder 2', 'lider2@email.com', '$2a$10$H3wOxjpAFNHXtx5yqX.zUuRzNpzjdVIV4j8Eu4.JTGkaO/CGOYzzm', 'Líder', NULL, '222.222.222-22'),
('Líder 3', 'lider3@email.com', '$2a$10$H3wOxjpAFNHXtx5yqX.zUuRzNpzjdVIV4j8Eu4.JTGkaO/CGOYzzm', 'Líder', NULL, '333.333.333-33'),
('Líder 4', 'lider4@email.com', '$2a$10$H3wOxjpAFNHXtx5yqX.zUuRzNpzjdVIV4j8Eu4.JTGkaO/CGOYzzm', 'Líder', NULL, '444.444.444-44'),
('Líder 5', 'lider5@email.com', '$2a$10$H3wOxjpAFNHXtx5yqX.zUuRzNpzjdVIV4j8Eu4.JTGkaO/CGOYzzm', 'Líder', NULL, '555.555.555-55'),
('Líder 6', 'lider6@email.com', '$2a$10$H3wOxjpAFNHXtx5yqX.zUuRzNpzjdVIV4j8Eu4.JTGkaO/CGOYzzm', 'Líder', NULL, '666.666.666-66'),
('Líder 7', 'lider7@email.com', '$2a$10$H3wOxjpAFNHXtx5yqX.zUuRzNpzjdVIV4j8Eu4.JTGkaO/CGOYzzm', 'Líder', NULL, '777.777.777-77'),
('Líder 8', 'lider8@email.com', '$2a$10$H3wOxjpAFNHXtx5yqX.zUuRzNpzjdVIV4j8Eu4.JTGkaO/CGOYzzm', 'Líder', NULL, '888.888.888-88'),
('Líder 9', 'lider9@email.com', '$2a$10$H3wOxjpAFNHXtx5yqX.zUuRzNpzjdVIV4j8Eu4.JTGkaO/CGOYzzm', 'Líder', NULL, '999.999.999-99'),
('Líder 10', 'lider10@email.com', '$2a$10$H3wOxjpAFNHXtx5yqX.zUuRzNpzjdVIV4j8Eu4.JTGkaO/CGOYzzm', 'Líder', NULL, '101.101.101-10'),
('Líder 11', 'lider11@email.com', '$2a$10$H3wOxjpAFNHXtx5yqX.zUuRzNpzjdVIV4j8Eu4.JTGkaO/CGOYzzm', 'Líder', NULL, '202.202.202-20'),
('Líder 12', 'lider12@email.com', '$2a$10$H3wOxjpAFNHXtx5yqX.zUuRzNpzjdVIV4j8Eu4.JTGkaO/CGOYzzm', 'Líder', NULL, '303.303.303-30'),
('Líder 13', 'lider13@email.com', '$2a$10$H3wOxjpAFNHXtx5yqX.zUuRzNpzjdVIV4j8Eu4.JTGkaO/CGOYzzm', 'Líder', NULL, '404.404.404-40'),
('Líder 14', 'lider14@email.com', '$2a$10$H3wOxjpAFNHXtx5yqX.zUuRzNpzjdVIV4j8Eu4.JTGkaO/CGOYzzm', 'Líder', NULL, '505.505.505-50'),
('Líder 15', 'lider15@email.com', '$2a$10$H3wOxjpAFNHXtx5yqX.zUuRzNpzjdVIV4j8Eu4.JTGkaO/CGOYzzm', 'Líder', NULL, '606.606.606-60');

SELECT categoria FROM Categoria_Perguntas WHERE categoria LIKE 'sa';
select * from Categoria_Perguntas;
select * from Perguntas;

