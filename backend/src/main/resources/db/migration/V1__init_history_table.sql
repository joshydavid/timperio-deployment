CREATE TYPE sales_type_enum AS ENUM ('CONSIGNMENT', 'DIRECT_B2B', 'DIRECT_B2C', 'MARKETING', 'WHOLESALER');
CREATE TYPE channel_type_enum AS ENUM ('ONLINE_WEBSITE', 'SHOPEE', 'OFFLINE');
CREATE TYPE shipping_method_enum AS ENUM ('STANDARD_DELIVERY', 'SAME_DAY_DELIVERY', 'SELF_COLLECT');

CREATE TABLE purchase_history (
    sales_id INT PRIMARY KEY,
    sales_date DATE NOT NULL,
    sales_type sales_type_enum NULL,
    channel_type channel_type_enum NULL,
    customer_id INT NOT NULL,
    zip_code INT NULL,
    shipping_method shipping_method_enum NOT NULL,
    product VARCHAR(100) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    variant INT NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
