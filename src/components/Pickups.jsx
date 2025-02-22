import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { io } from 'socket.io-client';
import './Pickups.css';
import { FaSearch, FaWeightHanging, FaConciergeBell, FaClock, FaClipboardList, FaCloudMeatball, FaFreeCodeCamp, FaDashcube, FaCookieBite, FaHome, FaTruck, FaMap, FaTractor, FaCashRegister, FaDollarSign, FaPowerOff, FaLightbulb, FaShoppingBasket, FaCartArrowDown, FaCartPlus, FaCaretSquareUp, FaShoppingCart } from 'react-icons/fa';



const Pickups = () => {
  const [pickups, setPickups] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  // const socket = io('http://localhost:3001'); // WebSocket connection to the server

  useEffect(() => {
    // Fetch surplus data from the backend
    const fetchSurplusData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/get-surplus');
        setPickups(response.data);
      } catch (error) {
        console.error('Error fetching surplus data:', error);
      }
    };

    fetchSurplusData();

    // Listen for 'item-accepted' event from the server
    // socket.on('item-accepted', (item) => {
    //   setPickups((prevPickups) => prevPickups.filter(pickup => pickup._id !== item._id));
    // });

    // Cleanup socket connection on unmount
    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  const handleAccept = async (item) => {
    try {
      const response = await axios.post(`http://localhost:3001/accept-pickup/${item._id}`);

      if (response.status === 200) {
        setCart((prevCart) => [...prevCart, item]);
        setPickups((prevPickups) => prevPickups.filter((pickup) => pickup._id !== item._id));
        
        // Emit 'accept-item' to notify other users
        // socket.emit('accept-item', item);
      }
    } catch (error) {
      console.error('Error accepting item:', error);
    }
  };




  

  const handleRemoveFromCart = (item) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem._id !== item._id));
    setPickups((prevPickups) => [...prevPickups, item]);
  };

  return (
    <div className="container-pi">
    
      <h2><FaShoppingCart/> Available Pickups</h2>
      <div className="pickup-list">
        {pickups.map((item) => (
          <div className="pickup-item" key={item._id}>
            <div className="pickup-details">
              <h4>{item.name}</h4>
              <p><strong>{item.description}</strong></p>
              <p>Pickup Time: <strong>{item.pickupTime}</strong> - Total: <strong>{item.quantity} items</strong></p>
              <p>Pickup Instructions: <em>{item.pickupInstructions}</em></p>
              <h5>Serving Size</h5>
              <p>{item.servingSize}</p>
            </div>
            <button className="accept-buttonz" onClick={() => handleAccept(item)}>Accept</button>
          </div>
        ))}
      </div>

      <button className="cart-button" onClick={() => setIsCartVisible(!isCartVisible)}>
        View your cart ({cart.length})
      </button>
      

      {isCartVisible && cart.length > 0 && (
        <div className="view-cart">
          <h3>Your Cart</h3>
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-item" key={item._id}>
                <div>
                  <h4>{item.name}</h4>
                  <p>Pickup Time: <strong>{item.pickupTime}</strong></p>
                </div>
                <button className="remove-button" onClick={() => handleRemoveFromCart(item)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pickups;
