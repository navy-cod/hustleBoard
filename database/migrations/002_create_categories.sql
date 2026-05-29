CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO categories (name, slug) VALUES
('Software Engineering', 'software-engineering'),
('Data Science', 'data-science'),
('Design', 'design'),
('Marketing', 'marketing'),
('Sales', 'sales'),
('Finance', 'finance'),
('Operations', 'operations'),
('Customer Support', 'customer-support'),
('Human Resources', 'human-resources'),
('Product Management', 'product-management');