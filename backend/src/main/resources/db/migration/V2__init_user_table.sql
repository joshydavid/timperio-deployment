CREATE TYPE role_enum AS ENUM ('MARKETING', 'SALES', 'ADMIN');

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    role role_enum NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO users (user_email, password, user_name, role, created_at, updated_at)
VALUES
    ('alice@timperio.com', '$2a$10$.ZPzfcohhejBIY6K8z2w/.5bx8iz5QKUNGKLAcTfW2xaIrp1LYs6O', 'Alice Johnson', 'MARKETING', NOW(), NOW()),
    ('bob@timperio.com', '$2a$10$.ZPzfcohhejBIY6K8z2w/.5bx8iz5QKUNGKLAcTfW2xaIrp1LYs6O', 'Bob Smith', 'SALES', NOW(), NOW()),
    ('charlie@timperio.com', '$2a$10$.ZPzfcohhejBIY6K8z2w/.5bx8iz5QKUNGKLAcTfW2xaIrp1LYs6O', 'Charlie Lee', 'ADMIN', NOW(), NOW()),
    ('marketing@timperio.com', '$2a$10$.ZPzfcohhejBIY6K8z2w/.5bx8iz5QKUNGKLAcTfW2xaIrp1LYs6O', 'Marketing Person', 'MARKETING', NOW(), NOW()),
    ('sales@timperio.com', '$2a$10$.ZPzfcohhejBIY6K8z2w/.5bx8iz5QKUNGKLAcTfW2xaIrp1LYs6O', 'Sales Person', 'SALES', NOW(), NOW()),
    ('admin@timperio.com', '$2a$10$.ZPzfcohhejBIY6K8z2w/.5bx8iz5QKUNGKLAcTfW2xaIrp1LYs6O', 'Admin Person', 'ADMIN', NOW(), NOW());