import React from 'react';
import './Nearby.css';
import { Link } from 'react-router-dom';

const Nearby = () => {
  return (
    <div className="container-n">
      <h2>Food for Good</h2>
      <h3>Restaurants Nearby</h3>
      <div className="restaurant-list">
        {['Pizzeria', 'Pizzeria', 'Pizzeria', 'Pizzeria'].map((name, index) => (
          <div className="restaurant-item" key={index}>
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT58G7nrNkv1XrT9ya56V5CEbmhsCancNEz5g&s" alt="food" />
            <div>
              <p>{name}</p>
              <p>10 items</p>
            </div>
            <button>View</button>
          </div>
        ))}
      </div>
     <Link to='/pickups'><button className="cart-button">View your cart (0)</button></Link> 
    </div>
  );
};

export default Nearby;
