import React, { useEffect, useState, useRef } from 'react';
import './Payment.css';

const Payment = () => {
  const [amount, setAmount] = useState('24'); // Default amount
  const paypalRef = useRef(null); // Reference to track if the PayPal button is rendered

  useEffect(() => {
    // Check if the PayPal button has already been rendered
    if (paypalRef.current) {
      return;
    }

    // Render the PayPal button when the component mounts
    window.paypal.Buttons({
      createOrder: (data, actions) => {
        // Set up the transaction
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: amount // Use the state value for the amount
            }
          }]
        });
      },
      onApprove: (data, actions) => {
        // Capture the funds from the transaction
        return actions.order.capture().then(details => {
          alert(`Transaction completed by ${details.payer.name.given_name}`);
          // Redirect or show success message here
        });
      },
      onError: (err) => {
        console.error('Payment error:', err);
        // Handle the error appropriately
      }
    }).render('#paypal-button-container');

    // Mark the PayPal button as rendered
    paypalRef.current = true;
  }, [amount]); // Re-render the PayPal button if the amount changes

  return (
    <div className="container-p">
      <h2>Payment</h2>
      <form>
        <div className="form-group">
          <label>To</label>
          <input type="text" placeholder="Taj Lands End" disabled />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            placeholder="$24"
            value={amount}
            onChange={(e) => setAmount(e.target.value)} // Update the amount state when the input changes
          />
        </div>
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" placeholder="Ashok" />
        </div>
        <div className="form-group">
          <label>Email ID</label>
          <input type="email" placeholder="abc@gmail.com" />
        </div>
        <div className="form-group">
          <label>Mobile Number</label>
          <input type="text" placeholder="Phone Number" />
        </div>
        <div id="paypal-button-container"></div> {/* PayPal button will be rendered here */}
      </form>
    </div>
  );
};

export default Payment;
