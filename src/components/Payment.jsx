import React, { useEffect, useState, useRef } from 'react';

const Payment = () => {
  const [amount, setAmount] = useState('24');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const paypalRef = useRef(null);
  const [showCreditCard, setShowCreditCard] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (paypalRef.current) return;

    const loadPaypalScript = () => {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=AZIVCGXyF6qojse99nYFgHai4msPkJdj_NC-nCrS3D7aVgcTRWZB6rH-Q2D0DLjgZ1JAdi-_FDy28QSO&currency=USD&components=buttons,card-fields`; // ADDED CARD FIELDS
      script.addEventListener('load', () => {
        // PayPal Buttons
        window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal',
            height: 40,
            tagline: false
          },
          createOrder: (data, actions) => {
            setIsProcessing(true);
            return actions.order.create({
              purchase_units: [{
                amount: { value: amount }
              }]
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
              setIsProcessing(false);
              alert(`Payment successful! Transaction ID: ${details.id}`);
            });
          },
          onError: (err) => {
            setIsProcessing(false);
            console.error('Payment error:', err);
            alert('Payment failed. Please try again.');
          }
        }).render('#paypal-button-container');

        // Credit Card Fields (if enabled)
        if(showCreditCard && window.paypal.HostedFields){
          window.paypal.HostedFields.render({
            fields: {
              number: { selector: "#card-number" },
              cvv: { selector: "#cvv" },
              expirationDate: { selector: "#expiration-date" }
            }
          });
        }
      });
      document.body.appendChild(script);
    };

    loadPaypalScript();
    paypalRef.current = true;

    return () => {
      document.body.querySelector('script[src*="paypal.com"]')?.remove();
    };
  }, [amount, showCreditCard]);

  return (
    <div className="!min-h-screen !bg-gradient-to-b !from-blue-50 !to-white !flex !items-center !justify-center !p-4">
      <div className="!w-full !max-w-6xl !bg-white !rounded-xl !shadow-xl !overflow-hidden !transition-all !duration-300 hover:!shadow-2xl">
        <div className="!bg-blue-600 !p-6 !text-white">
          <h2 className="!text-2xl !font-bold !text-center">Secure Payment</h2>
          <p className="!text-blue-100 !text-center !mt-2">Complete your donation</p>
        </div>

        <form className="!p-6 !space-y-5">
          {/* ... (Previous form fields remain unchanged) ... */}
          <form className="!p-6 !space-y-5">
          <div className="!space-y-1">
            <label className="!block !text-gray-700 !font-medium">Recipient</label>
            <input
              type="text"
              value="Taj Lands End"
              disabled
              className="!w-full !p-3 !border !border-gray-300 !rounded-lg !bg-gray-100 !cursor-not-allowed !text-gray-500"
            />
          </div>

          <div className="!space-y-1">
            <label className="!block !text-gray-700 !font-medium">Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="!w-full !p-3 !border !border-gray-300 !rounded-lg focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent"
              min="1"
              step="1"
            />
          </div>

          <div className="!space-y-1">
            <label className="!block !text-gray-700 !font-medium">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="!w-full !p-3 !border !border-gray-300 !rounded-lg focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent"
              required
            />
          </div>

          <div className="!space-y-1">
            <label className="!block !text-gray-700 !font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="!w-full !p-3 !border !border-gray-300 !rounded-lg focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent"
              required
            />
          </div>

          <div className="!space-y-1">
            <label className="!block !text-gray-700 !font-medium">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="!w-full !p-3 !border !border-gray-300 !rounded-lg focus:!ring-2 focus:!ring-blue-500 focus:!border-transparent"
              required
            />
          </div>

          <div id="paypal-button-container" className="!mt-6"></div>

          {isProcessing && (
            <div className="!flex !items-center !justify-center !space-x-2 !text-blue-600">
              <svg className="!animate-spin !h-5 !w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="!opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="!opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing Payment...</span>
            </div>
          )}

          <div className="!text-xs !text-gray-500 !text-center !mt-4">
            <p>Your payment is securely processed by PayPal. We never store your financial information.</p>
          </div>
        </form>


          <div id="paypal-button-container" className="!mt-6"></div>

          <div className="!flex !justify-center !my-4">
            <span className="!text-gray-400 !text-sm">OR</span>
          </div>

          <button 
            type="button" 
            onClick={() => setShowCreditCard(!showCreditCard)}
            className="!w-full !p-3 !bg-white !border !border-gray-300 !rounded-lg !flex !items-center !justify-center !gap-2 hover:!bg-gray-50"
          >
            <img 
              src="https://www.freepnglogos.com/uploads/visa-mastercard-logo-9.png" 
              alt="Cards" 
              className="!h-6 !object-contain"
            />
            <span>Pay with Card</span>
          </button>

          {showCreditCard && (
            <div className="!space-y-4 !mt-4 !p-4 !bg-gray-50 !rounded-lg">
              <div className="!space-y-1">
                <label className="!block !text-gray-700 !font-medium">Card Number</label>
                <div id="card-number" className="!p-3 !border !border-gray-300 !rounded-lg !bg-white"></div>
              </div>

              <div className="!grid !grid-cols-2 !gap-4">
                <div className="!space-y-1">
                  <label className="!block !text-gray-700 !font-medium">Expiry</label>
                  <div id="expiration-date" className="!p-3 !border !border-gray-300 !rounded-lg !bg-white"></div>
                </div>
                <div className="!space-y-1">
                  <label className="!block !text-gray-700 !font-medium">CVV</label>
                  <div id="cvv" className="!p-3 !border !border-gray-300 !rounded-lg !bg-white"></div>
                </div>
              </div>

              <button 
                type="button" 
                className="!w-full !p-3 !bg-blue-600 !text-white !rounded-lg hover:!bg-blue-700 !font-medium"
              >
                Pay ${amount}
              </button>
            </div>
          )}

          {isProcessing && (
            <div className="!flex !items-center !justify-center !space-x-2 !text-blue-600">
              <svg className="!animate-spin !h-5 !w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="!opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="!opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing Payment...</span>
            </div>
          )}

          <div className="!text-xs !text-gray-500 !text-center !mt-4">
            <p>Your payment is securely processed by PayPal. We never store your financial information.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
