

import React, { useState } from "react";


const CheckoutModal = ({ cartItems, onClose, onCheckoutSubmit }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

 
  const totalAmount = cartItems.reduce( 
    (total, item) => total + item.price * item.qty, 
    0
  );

  const handleSubmit = async () => {
  
    if (name.trim() === "" || phone.trim() === "") {
      alert("Please enter your name and phone number.");
      return;
    }

    setIsSubmitting(true);
    
    
    await onCheckoutSubmit(name, phone); 
    
    
    setIsSubmitting(false);
  };

  return (
   
    <div className="modal"> 
      <div className="modal-card">
        <> 
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Checkout
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          
          <div style={{textAlign: 'center', marginTop: '10px'}}>
              <strong>Total Payable: ₹{Math.round(totalAmount)}</strong>
          </div>
          
          <div style={{marginTop: '20px', display: 'flex', justifyContent: 'space-between'}}>
            <button
              onClick={onClose}
              style={{ background: '#ddd', color: '#111' }}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit} 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Generating Bill..." : "Generate Bill"}
            </button>
          </div>
        </>
      </div>
    </div>
  );
};

export default CheckoutModal;