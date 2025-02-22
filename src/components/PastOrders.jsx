import React from 'react';
import { motion } from 'framer-motion';
import './PastOrders.css';

const PastOrders = () => {
  const orders = [
    { name: 'Taj Lands End', address: '123 Ocean Drive', time: '2:30 PM', items: 10, status: 'Successful' },
    { name: 'Balaji', address: '456 Spice Lane', time: '3:00 PM', items: 5, status: 'Successful' },
    { name: 'Amrut Sagar', address: '789 Curry Street', time: '4:15 PM', items: 8, status: 'Successful' },
  ];

  return (
    <div className="container-past mx-auto! max-w-7xl! px-4! py-8!">
      <h2 className="text-3xl! font-semibold! text-gray-900! mb-6! text-center!">List of Orders</h2>
      <div className="order-list space-y-4!">
        {orders.map((order, index) => (
          <motion.div
            className="order-item flex justify-between! items-center! bg-white! shadow-lg! rounded-lg! p-4! hover:bg-green-50! transition-colors! duration-300!"
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div>
              <h4 className="text-xl! font-bold! text-gray-800!">{order.name}</h4>
              <p className="text-gray-600!">{order.address}</p>
              <p className="text-gray-500!">{order.time} - {order.items} items</p>
            </div>
            <span className={`status text-sm! font-medium! ${order.status === 'Successful' ? 'text-green-600!' : 'text-red-600!'}`}>
              {order.status}
            </span>
          </motion.div>
        ))}
      </div>
      {/* Uncomment the button to enable cart functionality */}
      {/* <button className="cart-button-past mt-6! bg-green-600! text-white! px-6! py-2.5! rounded-full! hover:bg-green-700! transition-colors! duration-300!" onClick={() => alert('View your cart')}>View your cart (0)</button> */}
    </div>
  );
};

export default PastOrders;
