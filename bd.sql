CREATE DATABASE petshop_db;
USE petshop_db;

CREATE TABLE usuarios (
    idUsuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agendamentos (
    idAgendamento INT AUTO_INCREMENT PRIMARY KEY,
    fkUsuario INT NOT NULL,
    nomePet VARCHAR(100) NOT NULL,
    servico VARCHAR(50) NOT NULL,
    data_agendada DATE NOT NULL,
    horario TIME NOT NULL,
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fkUsuario) REFERENCES usuarios(idUsuario)
);

CREATE TABLE images(
	id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);