

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    price REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productId INTEGER,
    qty INTEGER
  )`);

  const products = [
    ['Protein Powder', 2500],
    ['Gym Gloves', 500],
    ['Shaker Bottle', 300],
    ['Treadmill Oil', 200],
    ['Resistance Band', 450],
    ['Yoga Mat', 700],
    ['Pre-Workout Drink', 1200],
    ['Dumbbells (5kg pair)', 1800],
    ['Pull-up Bar', 1600],
    ['Skipping Rope', 150],
  ];

  db.run('DELETE FROM products'); // clear old data

  const stmt = db.prepare('INSERT INTO products (name, price) VALUES (?, ?)');
  for (const [name, price] of products) {
    stmt.run(name, price);
  }
  stmt.finalize();

  console.log('✅ Database setup completed and products inserted.');
});

db.close();
