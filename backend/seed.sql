-- products table
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price REAL NOT NULL
);

-- cart table
CREATE TABLE IF NOT EXISTS cart (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  productId INTEGER NOT NULL,
  qty INTEGER NOT NULL,
  FOREIGN KEY(productId) REFERENCES products(id)
);

-- seed product rows
INSERT INTO products (name, price) VALUES
('Vibe T-Shirt', 599.00),
('Eco Water Bottle', 349.00),
('Wireless Earbuds', 2499.00),
('Sendha Namak', 999.00),
('Travel Backpack', 1999.00);

