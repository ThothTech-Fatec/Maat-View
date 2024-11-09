-- Criar o banco de dados e usar o banco de dados maatview
CREATE DATABASE IF NOT EXISTS maatview;
USE maatview;

-- Tabela de Usuários com CPF e auto-relacionamento para líder
CREATE TABLE IF NOT EXISTS Users (
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

-- Tabela de Pesquisas
CREATE TABLE IF NOT EXISTS Pesquisas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(150) NOT NULL,
    sobre VARCHAR(255) NOT NULL,
    cat_pes ENUM('Auto Avaliação', 'Avaliação de Liderado', 'Avaliação de Líder') NOT NULL
);

-- Tabela de Categorias de Perguntas
CREATE TABLE IF NOT EXISTS Categoria_Perguntas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    categoria VARCHAR(50) NOT NULL
);

-- Tabela de Perguntas
CREATE TABLE IF NOT EXISTS Perguntas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sobre VARCHAR(255) NOT NULL,
    formato ENUM('Texto Longo', 'Escolha Única', 'Múltipla Escolha') NOT NULL,
    cat_id INT,
    FOREIGN KEY (cat_id) REFERENCES Categoria_Perguntas(id)
);

-- Tabela de Pesquisas e Perguntas (mapeamento)
CREATE TABLE IF NOT EXISTS Pesquisas_Perguntas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pes_id INT,
    per_id INT,
    FOREIGN KEY (pes_id) REFERENCES Pesquisas(id),
    FOREIGN KEY (per_id) REFERENCES Perguntas(id)
);

-- Tabela de Opções para Perguntas de escolha única ou múltipla
CREATE TABLE IF NOT EXISTS Opções (
    id INT AUTO_INCREMENT PRIMARY KEY,
    per_id INT,
    pes_id INT,
    texto VARCHAR(100) NOT NULL,
    FOREIGN KEY (pes_id) REFERENCES Pesquisas(id),
    FOREIGN KEY (per_id) REFERENCES Perguntas(id)
);

-- Tabela de Respostas
CREATE TABLE IF NOT EXISTS Respostas (
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

-- Tabela de Avaliações Direcionadas
CREATE TABLE IF NOT EXISTS Avaliacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pes_id INT,
    user_id INT, -- Quem será avaliado (liderado ou líder)
    responsavel_id INT, -- Quem deve responder a avaliação (o líder ou liderado correspondente)
    FOREIGN KEY (pes_id) REFERENCES Pesquisas(id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (responsavel_id) REFERENCES Users(id)
);

-- Tabela Temporária para Respostas antes de duplicação
CREATE TABLE IF NOT EXISTS Temp_Respostas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    per_id INT,
    ava_id INT,
    resp_texto VARCHAR(255),
    select_option_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (per_id) REFERENCES Perguntas(id),
    FOREIGN KEY (ava_id) REFERENCES Avaliacoes(id),
    FOREIGN KEY (select_option_id) REFERENCES Opções(id)
);



-- Exemplo de inserção de um admin, líderes e liderado
INSERT INTO Users (nome, email, senha, cargo, lider_id, cpf) VALUES
('Admin User', 'admin@email.com', '$2a$10$ddNpc6kVtPXVtsrnxYoTp.6mzgEuKGTS4PdoRdtuY7vJea/2TJlyu', 'Admin', NULL, '123.456.789-00'),
('Líder 1', 'lider1@email.com', '$2a$10$ddNpc6kVtPXVtsrnxYoTp.6mzgEuKGTS4PdoRdtuY7vJea/2TJlyu', 'Líder', NULL, '111.111.111-11'),
('Liderado User', 'liderado@email.com', '$2a$10$I1QNViM5N1c8d3ro6uD4F.MaxZ0FBy59Ye1bjrs1TNtkA/1orKYIa', 'Liderado', 2, '009.876.543-21');

-- Exemplo de chamada do procedimento ao completar uma autoavaliação
-- Aqui, o usuário com id 3 (Liderado) completou a pesquisa de autoavaliação com id 1.

-- Exemplo de consulta para exibir as avaliações pendentes de um líder ou liderado
SELECT a.id AS avaliacao_id, p.titulo AS pesquisa_titulo, u.nome AS nome_avaliado
FROM Avaliacoes a
JOIN Pesquisas p ON a.pes_id = p.id
JOIN Users u ON a.user_id = u.id
WHERE a.responsavel_id = 2;

-- Teste de verificação
SELECT * FROM Avaliacoes;
SELECT * FROM Pesquisas;
SELECT * FROM Users WHERE id = 3;

select * from Respostas;
select * from Temp_Respostas;




