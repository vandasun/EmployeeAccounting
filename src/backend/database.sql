CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    last_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    patronymic VARCHAR(100),
    birth_date DATE,
    passport_series VARCHAR(4),
    passport_number VARCHAR(6),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    position_id INTEGER REFERENCES positions(id) ON DELETE SET NULL,
    salary NUMERIC(10, 2),
    hire_date DATE NOT NULL,
    fired BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_employees_full_name ON employees(last_name, first_name, patronymic);
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_position ON employees(position_id);
CREATE INDEX idx_employees_fired ON employees(fired);