CREATE TABLE Banks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO Banks (name)
VALUES 
    ('Тинькофф'),
    ('Сбер'),
    ('ВТБ');

CREATE TABLE FinancialProducts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

INSERT INTO FinancialProducts (name)
VALUES 
    ('Кредиты'),
    ('Ипотека');
