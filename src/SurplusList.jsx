import React, { useState, useEffect, useRef } from 'react';
import './SurplusList.css';
import axios from 'axios';
import { FaSearch, FaWeightHanging, FaConciergeBell, FaClock, FaClipboardList, FaCloudMeatball, FaFreeCodeCamp, FaDashcube, FaCookieBite } from 'react-icons/fa';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import io from 'socket.io-client';

function SurplusList() {

  // Initial form state
  const initialFormData = {
    name: '',
    description: '',
    quantity: '',
    servingSize: '',
    pickupInstructions: '',
    pickupTime: ''
  };

  // State management for form data, suggestions, and listings
  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [foodSuggestions, setFoodSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [dropdownState, setDropdownState] = useState({
    food: false,
    quantity: false,
    servingSize: false,
  });
  const [activeListings, setActiveListings] = useState([]);
  const [userName, setUserName] = useState(''); // New state to store the user's name

  const inputRefs = useRef({});

   
  // Fetch user details using the token from cookie
  const fetchUserName = async () => {
    try {
      // Send a GET request to fetch user details using the token stored in cookies
      const response = await axios.get('http://localhost:3001/user', {
        withCredentials: true, // Make sure cookies are sent with the request
      });

      if (response.data && response.data.firstName) {
        setUserName(response.data.firstName); // Set the user's firstName in the state
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserName(); // Fetch user name when the component mounts
  }, []);




  // Fetch food suggestions from Unsplash API
  const fetchFoodSuggestions = async (query = 'food') => {
    try {
      const response = await axios.get('https://api.unsplash.com/search/photos', {
        params: {
          query,
          client_id: 'wxDg2ql8m2gaSVrzQ03UuS4E-OPfXb5Xnc26hzzeTW8'
        }
      });
      setFoodSuggestions(response.data.results.map(photo => ({
        name: photo.alt_description.split(',')[0],
        image: photo.urls.small
      })));
    } catch (error) {
      console.error('Error fetching food suggestions:', error);
    }
  };

  // Fetch active surplus listings
  const fetchActiveListings = async () => {
    try {
      const response = await axios.get('http://localhost:3001/active-listings');
      setActiveListings(response.data);
    } catch (error) {
      console.error('Error fetching active listings:', error);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    fetchFoodSuggestions();  // Fetch initial food suggestions
    fetchActiveListings();   // Fetch active listings when component mounts
    fetchUserName();         // Fetch user name on mount

    const handleClickOutside = (e) => {
      Object.keys(dropdownState).forEach(key => {
        if (inputRefs.current[key] && !inputRefs.current[key].contains(e.target)) {
          setDropdownState(prevState => ({ ...prevState, [key]: false }));
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));

    if (name === 'name') {
      setDropdownState(prevState => ({ ...prevState, food: true }));
      setFilteredSuggestions(foodSuggestions.filter(food =>
        food.name.toLowerCase().includes(value.toLowerCase())
      ));
      fetchFoodSuggestions(value);
    } else if (name === 'quantity') {
      setDropdownState(prevState => ({ ...prevState, quantity: true }));
    } else if (name === 'servingSize') {
      setDropdownState(prevState => ({ ...prevState, servingSize: true }));
    }
  };

  // Handle dropdown selection
  const handleDropdownSelect = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setDropdownState(prevState => ({ ...prevState, [name]: false }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setWhatsappLink(''); // Clear the existing link

    try {
        // Send the form data to the backend for listing the surplus item
        const response = await axios.post('http://localhost:3001/list-surplus', formData);

        // Check if the backend response contains the WhatsApp link
        if (response.data.whatsappLink) {
            setWhatsappLink(response.data.whatsappLink); // Set the WhatsApp link from backend response
            console.log(response.data.whatsappLink);
        }

        // Show success message
        setMessage('Surplus item listed successfully!');
        
        // Reset form after successful submission
        setFormData(initialFormData); // Reset the form data
        
        // Refresh active listings (optional)
        fetchActiveListings();

        // Store the newly submitted surplus data in a cookie if you want to persist it across page refreshes
        document.cookie = `surplus_data=${JSON.stringify(formData)}; max-age=${10 * 24 * 60 * 60}; path=/`;
    } catch (error) {
        console.error(error);
        setMessage('Failed to list surplus item. Please try again.');
    }
  };

  // Function to get the value of a cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  // Handle "View Previous Listing" button click
  const handleViewPreviousListing = () => {
    const surplusDataFromCookie = getCookie('surplus_data');
    if (surplusDataFromCookie) {
        const parsedData = JSON.parse(surplusDataFromCookie);
        setFormData(parsedData); // Autofill the form with the cookie data
    }
  };

  // Handle Delete
  const handleDelete = async (listingId) => {
    try {
      // Make a DELETE request to your backend to delete the listing by its ID
      await axios.delete(`http://localhost:3001/active-listings/${listingId}`);

      // After deleting, display a success message
      setMessage('Listing deleted successfully.');

      // Refresh the active listings
      fetchActiveListings();
    } catch (error) {
      console.error('Error deleting listing:', error);

      // If an error occurs, display an error message
      setMessage('Failed to delete listing.');
    }
  };
 


  return (
    <div className="container-s">
  <div className="welcome-message">
    {userName ? <h2>Welcome, {userName}!</h2> : <p className="loading-text">Loading...</p>}
  </div>
      <div className='welcomeflex'>
        <h3>List Surplus</h3>
      </div>
      {/* Welcome Message */}


     
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="surplus-form">
        {/* Form fields */}
        <div className="form-group">
          <label><FaClipboardList /> Item Name</label>
          <div className="custom-dropdown" ref={el => (inputRefs.current.food = el)}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="E.g., Paneer Tikka, Egg Omelette"
              required
            />
          </div>
        </div>

        {/* Quantity Input with Dropdown */}
        <div className="form-group">
          <label><FaWeightHanging /> Quantity</label>
          <input
            type="text"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="E.g., 10 kg"
            required
          />
        </div>

        {/* Serving Size Input with Dropdown */}
        <div className="form-group">
          <label><FaConciergeBell /> Serving Size</label>
          <input
            type="text"
            name="servingSize"
            value={formData.servingSize}
            onChange={handleChange}
            placeholder="E.g., Serves 1"
            required
          />
        </div>

        {/* Other Inputs */}
        <div className="form-group">
          <label><FaClipboardList /> Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="E.g., Fresh Paneer Tikka, perfect for quick meals."
            rows="3"
            required
          />
        </div>

        <div className="form-group">
          <label><FaClipboardList /> Pickup Instructions</label>
          <input
            type="text"
            name="pickupInstructions"
            value={formData.pickupInstructions}
            onChange={handleChange}
            placeholder="E.g., Pickup at 123 Street, 9 AM"
            required
          />
        </div>
        
        <div className="form-group">
          <label><FaClock /> Pickup Time</label>
          <input
            type="text"
            name="pickupTime"
            value={formData.pickupTime}
            onChange={handleChange}
            placeholder="E.g., 2 PM"
            required
          />
        </div>
        {/* Other form fields here... */}
        <button type="submit" className="submit-button">Save Changes</button>
      </form>

      {/* View Previous Listing Button */}
      <button type="button" className="view-button" onClick={handleViewPreviousListing}>
        View Previous Listing
      </button>

      {/* Active Listings */}
      <h3>Active Surplus Listings</h3>
      <div className="active-listings">
        {activeListings.length > 0 ? (
          activeListings.map((listing) => (
            <div key={listing._id} className="listing-item">
              <div className="listing-info">
                <div className="info-item name">
                  <strong>Name:</strong> <span>{listing.name}</span>
                </div>
                <div className="info-item description">
                  <strong>Description:</strong> <span>{listing.description}</span>
                </div>
                <div className="info-item quantity">
                  <strong>Quantity:</strong> <span>{listing.quantity}</span>
                </div>
                <div className="info-item serving-size">
                  <strong>Serving Size:</strong> <span>{listing.servingSize}</span>
                </div>
              </div>
              <div className="listing-actions">
                <button className="edit-button" onClick={() => handleEdit(listing._id)}>
                  <i className="fa fa-edit"></i> Edit
                </button>
                <button className="delete-button" onClick={() => handleDelete(listing._id)}>
                  <i className="fa fa-trash"></i> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No active surplus listings available.</p>
        )}
      </div>
    </div>
  );
}

export default SurplusList;
