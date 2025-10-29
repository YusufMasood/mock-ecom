import React from "react";

export default function CartView({ items, total, onRemove, onQty, onCheckout, onClose }) {
  return (
    <div className="cart-view" style={styles.cartContainer}>
      
      <button onClick={onClose} style={styles.closeButton}>
        ✕
      </button>

      <h2>🛒 Your Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="cart-item" style={styles.cartItem}>
              <div className="item-info" style={styles.itemInfo}>
                <strong>{item.name}</strong>
                <span>₹{Math.round(item.price)}</span>
              </div>

              <div className="item-actions" style={styles.itemActions}>
                <button onClick={() => onQty(item.id, item.qty - 1)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => onQty(item.id, item.qty + 1)}>+</button>
                <button className="remove-btn" onClick={() => onRemove(item.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="cart-total" style={styles.cartTotal}>
            <strong>Total: ₹{Math.round(total)}</strong>
          </div>
          <button className="checkout-btn" style={styles.checkoutBtn} onClick={onCheckout}>
            Checkout
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  cartContainer: {
    position: "fixed",
    top: 0,
    right: 0,
    width: "400px",
    height: "100vh",
    backgroundColor: "#1a1a1a",
    color: "white",
    padding: "20px",
    boxShadow: "-4px 0 15px rgba(0,0,0,0.5)",
    overflowY: "auto",
    zIndex: 2000,
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#ff4757",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  cartItem: {
    background: "#2f3542",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  itemInfo: {
    display: "flex",
    justifyContent: "space-between",
  },
  itemActions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "8px",
  },
  cartTotal: {
    marginTop: "20px",
    textAlign: "center",
  },
  checkoutBtn: {
    display: "block",
    margin: "20px auto",
    backgroundColor: "#00a8ff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
