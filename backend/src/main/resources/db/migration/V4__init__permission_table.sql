CREATE TABLE permission (
    permission_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE role_permission (
    role_permission_id SERIAL PRIMARY KEY,
    role role_enum NOT NULL, 
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (permission_id) REFERENCES permission(permission_id) ON DELETE CASCADE
);

INSERT INTO permission (name) VALUES
    ('ACCESS AND FILTER PURCHASE HISTORY'),
    ('EXPORT FILTERED DATA'),
    ('SEGMENT CUSTOMERS BY SPENDING'),
    ('CREATE AND SEND NEWSLETTER'),
    ('VIEW SALES METRICS'),
    ('MANAGE USER ACCOUNTS'),
    ('FORMAT NEWSLETTER TEMPLATE');

INSERT INTO role_permission (role, permission_id) VALUES
    ('MARKETING', (SELECT permission_id FROM permission WHERE name = 'ACCESS AND FILTER PURCHASE HISTORY')),
    ('MARKETING', (SELECT permission_id FROM permission WHERE name = 'EXPORT FILTERED DATA')),
    ('MARKETING', (SELECT permission_id FROM permission WHERE name = 'SEGMENT CUSTOMERS BY SPENDING')),
    ('MARKETING', (SELECT permission_id FROM permission WHERE name = 'CREATE AND SEND NEWSLETTER'));

-- SALES role
INSERT INTO role_permission (role, permission_id) VALUES
    ('SALES', (SELECT permission_id FROM permission WHERE name = 'ACCESS AND FILTER PURCHASE HISTORY')),
    ('SALES', (SELECT permission_id FROM permission WHERE name = 'VIEW SALES METRICS'));

-- ADMIN role
INSERT INTO role_permission (role, permission_id) VALUES
    ('ADMIN', (SELECT permission_id FROM permission WHERE name = 'MANAGE USER ACCOUNTS')),
    ('ADMIN', (SELECT permission_id FROM permission WHERE name = 'FORMAT NEWSLETTER TEMPLATE'));
