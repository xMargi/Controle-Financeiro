CREATE TYPE type_transaction AS ENUM('Receita', 'Despesa');

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE categories(
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type type_transaction NOT NULL,
    users_id INT NOT NULL,
    FOREIGN KEY (users_id) REFERENCES users(id)
);

CREATE TABLE transactions(
    id SERIAL PRIMARY KEY,
    description VARCHAR(250),
    value NUMERIC NOT NULL,
    type type_transaction NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT NOW(),
    categories_id INT NOT NULL,
    users_id INT NOT NULL,
    FOREIGN KEY (categories_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (users_id) REFERENCES users(id) 
);