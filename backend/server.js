const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const DB_FILE = path.join(__dirname, 'db.sqlite');
const SEED_SQL_PATH = path.join(__dirname, 'seed.sql');
const SEED_SQL = fs.existsSync(SEED_SQL_PATH) ? fs.readFileSync(SEED_SQL_PATH, 'utf8') : '';

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, '');
}

const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) return console.error('DB open error', err);
  if (SEED_SQL) {
    db.exec(SEED_SQL, (err2) => {
      if (err2) console.error('DB seed error', err2);
      else console.log('DB seeded (if tables missing).');
    });
  }
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/api/products', (req, res) => {
  db.all('SELECT id, name, price FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/cart', (req, res) => {
  const sql = `SELECT cart.id as id, p.id as productId, p.name, p.price, cart.qty
               FROM cart JOIN products p ON cart.productId = p.id`;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const items = rows.map(r => ({ id: r.id, productId: r.productId, name: r.name, price: r.price, qty: r.qty }));
    const total = items.reduce((s, it) => s + it.price * it.qty, 0);
    res.json({ items, total });
  });
});

app.post('/api/cart', (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || !qty || qty <= 0) return res.status(400).json({ error: 'productId and qty required' });
  db.get('SELECT id, qty FROM cart WHERE productId = ?', [productId], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      const newQty = row.qty + qty;
      db.run('UPDATE cart SET qty = ? WHERE id = ?', [newQty, row.id], function(err2) {
        if (err2) return res.status(500).json({ error: err2.message });
        return res.json({ id: row.id, productId, qty: newQty });
      });
    } else {
      db.run('INSERT INTO cart (productId, qty) VALUES (?, ?)', [productId, qty], function(err3) {
        if (err3) return res.status(500).json({ error: err3.message });
        return res.status(201).json({ id: this.lastID, productId, qty });
      });
    }
  });
});

app.post('/api/cart/:id', (req, res) => {
  const id = req.params.id;
  const { qty } = req.body;
  if (!qty || qty <= 0) return res.status(400).json({ error: 'qty required and > 0' });
  db.run('UPDATE cart SET qty = ? WHERE id = ?', [qty, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ id, qty });
  });
});

app.delete('/api/cart/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM cart WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ success: true });
  });
});

app.post('/api/checkout', (req, res) => {
  const { cartItems, name, email } = req.body;
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: 'cartItems required' });
  }
  const ids = cartItems.map(ci => ci.productId);
  const placeholders = ids.map(() => '?').join(',');
  db.all(`SELECT id, name, price FROM products WHERE id IN (${placeholders})`, ids, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const priceMap = {};
    rows.forEach(r => priceMap[r.id] = { name: r.name, price: r.price });
    let total = 0;
    const items = cartItems.map(ci => {
      const p = priceMap[ci.productId] || { name: 'Unknown', price: 0 };
      const lineTotal = p.price * ci.qty;
      total += lineTotal;
      return { productId: ci.productId, name: p.name, price: p.price, qty: ci.qty, lineTotal };
    });
    const receipt = {
      id: 'rcpt_' + Date.now(),
      name: name || null,
      email: email || null,
      items,
      total,
      timestamp: new Date().toISOString()
    };
    db.run('DELETE FROM cart', [], (err2) => {
      if (err2) console.error('failed clearing cart', err2);
      res.json({ receipt });
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Mock e-com backend listening on http://localhost:${PORT}`));
