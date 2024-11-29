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
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
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
	data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
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
    data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    select_option_id INT,
    FOREIGN KEY (pes_id) REFERENCES Pesquisas(id),
    FOREIGN KEY (per_id) REFERENCES Perguntas(id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (select_option_id) REFERENCES Opções(id)
);

-- Tabela de Avaliações Direcionadas
CREATE TABLE IF NOT EXISTS Avaliacoes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    original_pes_id INT,
    pes_id INT,
    user_id INT, -- Quem será avaliado (liderado ou líder)
    responsavel_id INT, -- Quem deve responder a avaliação (o líder ou liderado correspondente)
	FOREIGN KEY (original_pes_id) REFERENCES Pesquisas(id),
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
('Rodolfo Líder', 'lider1@email.com', '$2a$10$ddNpc6kVtPXVtsrnxYoTp.6mzgEuKGTS4PdoRdtuY7vJea/2TJlyu', 'Líder', NULL, '111.111.111-11'),
('Antônio Liderado', 'liderado@email.com', '$2a$10$I1QNViM5N1c8d3ro6uD4F.MaxZ0FBy59Ye1bjrs1TNtkA/1orKYIa', 'Liderado', 2, '009.876.543-21');

INSERT INTO Pesquisas (titulo, sobre, data_criacao, cat_pes) 
VALUES ('Pesquisa de Clima Organizacional', 'Pesquisa voltada para avaliar o clima organizacional e a comunicação interna.', '2024-09-12 17:37:37', 'Auto Avaliação');

-- Inserindo categorias de perguntas
INSERT INTO Categoria_Perguntas (categoria) VALUES
('Gestão de Equipe'),
('Comunicação Organizacional'),
('Bem-estar no Trabalho');

-- Inserindo perguntas com diferentes tipos
INSERT INTO Perguntas(sobre, formato, cat_id) VALUES
('Como você avalia a liderança da sua equipe?', 'Texto Longo', 1),
('Como você avalia o feedback recebido por sua liderança?', 'Escolha Única', 1),
('Quais aspectos do ambiente de trabalho você considera mais importantes?', 'Múltipla Escolha', 2),
('Como você avalia a comunicação dentro da empresa?', 'Escolha Única', 2),
('Quais aspectos do seu trabalho afetam mais seu bem-estar?', 'Múltipla Escolha', 3);

Insert Into Pesquisas_Perguntas(pes_id, per_id) VALUES
(1,1),
(1,2);

INSERT INTO Pesquisas (titulo, sobre, cat_pes) 
VALUES ('Pesquisa de Satisfação dos Funcionários', 'Pesquisa focada em avaliar a satisfação geral dos funcionários e os aspectos do ambiente de trabalho.', 'Auto Avaliação');
Insert Into Pesquisas_Perguntas(pes_id, per_id) VALUES
(2,3),
(2,4),
(2,5);

-- Associando as opções às perguntas de múltipla escolha
INSERT INTO Opções (per_id, pes_id, texto) VALUES
(3, 2, 'Comunicação eficaz'),
(3, 2, 'Infraestrutura adequada'),
(3, 2, 'Reconhecimento e feedback'),
(3, 2, 'Cultura organizacional'),

(2, 1, 'Ruim'),
(2, 1, 'Neutro'),
(2, 1, 'Bom'),
(2, 1, 'Excelente'),

(4, 2, 'Ruim'),
(4, 2, 'Neutro'),
(4, 2, 'Bom'),
(4, 2, 'Excelente'),

(5, 2, 'Comunicação eficaz'),
(5, 2, 'Infraestrutura adequada'),
(5, 2, 'Reconhecimento e feedback'),
(5, 2, 'Cultura organizacional');

-- Teste de verificação
SELECT * FROM Avaliacoes;
SELECT * FROM Pesquisas;
SELECT * FROM Perguntas;
SELECT * FROM Pesquisas_Perguntas;
SELECT * FROM Users;

select * from Respostas;
select * from Temp_Respostas;

