
import React, { useEffect, useState } from "react";
import {
  fetchProducts,
  fetchCart,
  addToCart,
  removeCartItem,
  updateCartItem,
  checkout,
} from "./api";
import ProductList from "./components/ProductList";
import CartView from "./components/CartView";
import CheckoutModal from "./components/CheckoutModal";
import "./styles.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);

  
  const loadProducts = async () => setProducts(await fetchProducts());
  const loadCart = async () => setCart(await fetchCart());

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

 
  const handleAdd = async (productId) => {
    await addToCart(productId, 1);
    await loadCart();
  };

  const handleRemove = async (itemId) => {
    await removeCartItem(itemId);
    await loadCart();
  };

  const handleQty = async (itemId, qty) => {
    if (qty < 1) return;
    await updateCartItem(itemId, qty);
    await loadCart();
  };

  
  const handleCheckout = async (name, phone) => { 
    const payload = {
      cartItems: cart.items.map((i) => ({
        productId: i.productId,
        qty: i.qty,
      })),
      name,
      phone,
    };
    
    const res = await checkout(payload); 

   
    const finalReceipt = {
      ...res.receipt,
      name,  
      phone, 
    };

    setReceipt(finalReceipt);
    setShowCheckout(false);
    setShowCart(false);
    await loadCart(); 
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Vibe — Mock Shop</h1>
        <div
          className="cart-summary"
          onClick={() => setShowCart(true)}
          style={{ cursor: "pointer" }}
        >
          🛒 Items: {cart.items.length} • Total: ₹{Math.round(cart.total)}
        </div>
      </header>

      <main className="main">
        <ProductList products={products} onAdd={handleAdd} />
      </main>

      
      {showCart && (
        <div
          className="cart-overlay"
          onClick={() => setShowCart(false)} 
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "flex-end",
            zIndex: 1500,
          }}
        >
          <div
             onClick={(e) => e.stopPropagation()} 
          >
            <CartView
              items={cart.items}
              total={cart.total}
              onRemove={handleRemove}
              onQty={handleQty}
              onCheckout={() => setShowCheckout(true)}
              onClose={() => setShowCart(false)}
            />
          </div>
        </div>
      )}

     
      {showCheckout && (
        <CheckoutModal
          cartItems={cart.items}
          onClose={() => setShowCheckout(false)}
          onCheckoutSubmit={handleCheckout}
        />
      )}

      
      {receipt && (
        <div className="receipt-modal">
          <div className="receipt-card">
            <h3>Receipt</h3>
            <div>Receipt ID: {receipt.id}</div>
            <div>Time: {new Date(receipt.timestamp).toLocaleString()}</div>
            <div>Name: {receipt.name}</div>
            
            <div>Contact: {receipt.phone || receipt.email || 'N/A'}</div> 
            <ul>
              {receipt.items.map((it) => (
                <li key={it.productId}>
                  {it.name} x{it.qty} — ₹{Math.round(it.lineTotal)}
                </li>
              ))}
            </ul>
            <strong>Total: ₹{Math.round(receipt.total)}</strong>
            <button onClick={() => setReceipt(null)}>Close</button>
          </div>
        </div>
      )}

      <footer className="footer">
        Built for Vibe Commerce screening — mock checkout only.
      </footer>
    </div>
  );
}

export default App;