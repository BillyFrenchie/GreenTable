import React, { useState, useEffect, useRef } from 'react';
import { 
  FaSearch, 
  FaWeightHanging, 
  FaConciergeBell, 
  FaClock, 
  FaClipboardList, 
  FaUtensils,
  FaMapMarkerAlt,
  FaTrashAlt,
  FaEdit,
  FaHistory,
  FaShare,
  FaWhatsapp
} from 'react-icons/fa';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

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

  // State management
  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [whatsappLink, setWhatsappLink] = useState('');
  const [foodSuggestions, setFoodSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [dropdownState, setDropdownState] = useState({
    food: false,
    quantity: false,
    servingSize: false,
  });
  const [activeListings, setActiveListings] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const inputRefs = useRef({});
  const formRef = useRef(null);

  // Fetch user details using the token from cookie
  const fetchUserName = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/user', {
        withCredentials: true,
      });

      if (response.data && response.data.firstName) {
        setUserName(response.data.firstName);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

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
        name: photo.alt_description ? photo.alt_description.split(',')[0] : 'Food item',
        image: photo.urls.small
      })));
    } catch (error) {
      console.error('Error fetching food suggestions:', error);
    }
  };

  // Fetch active surplus listings
  const fetchActiveListings = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/active-listings', {
        withCredentials: true, // Ensure cookies (like loggedin_token) are sent with the request
      });
      setActiveListings(response.data);
    } catch (error) {
      console.error('Error fetching active listings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchFoodSuggestions();
    fetchActiveListings();
    fetchUserName();

    const handleClickOutside = (e) => {
      Object.keys(dropdownState).forEach(key => {
        if (inputRefs.current[key] && !inputRefs.current[key].contains(e.target)) {
          setDropdownState(prevState => ({ ...prevState, [key]: false }));
        }
      });
      
      if (showSuggestions && !inputRefs.current.food?.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSuggestions]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));

    if (name === 'name') {
      setShowSuggestions(true);
      setFilteredSuggestions(foodSuggestions.filter(food =>
        food.name.toLowerCase().includes(value.toLowerCase())
      ));
      
      if (value.length > 2) {
        fetchFoodSuggestions(value);
      }
    }
  };

  // Handle dropdown selection
  const handleDropdownSelect = (name, value) => {
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setShowSuggestions(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setWhatsappLink('');
    setLoading(true);

    try {
      let response;
      
      if (isEditing && editingId) {
        // Update existing listing
        response = await axios.put(`http://localhost:3001/active-listings/${editingId}`, formData, {
          withCredentials: true  // Add this option to send cookies
        });
        setMessage('Surplus item updated successfully!');
        setMessageType('success');
      } else {
        // Create new listing
        response = await axios.post('http://localhost:3001/list-surplus', formData, {
          withCredentials: true  // Add this option to send cookies
        });
        
        if (response.data.whatsappLink) {
          setWhatsappLink(response.data.whatsappLink);
        }
        
        setMessage('Surplus item listed successfully!');
        setMessageType('success');
        
        // Store in cookie for "View Previous Listing" functionality
        document.cookie = `surplus_data=${JSON.stringify(formData)}; max-age=${10 * 24 * 60 * 60}; path=/`;
      }
      
      // Reset form after successful submission
      setFormData(initialFormData);
      setIsEditing(false);
      setEditingId(null);
      
      // Refresh active listings
      fetchActiveListings();
    } catch (error) {
      console.error(error);
      setMessage('Failed to process surplus item. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
      
      // Scroll to top to show the message
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      setFormData(parsedData);
      setIsEditing(false);
      setEditingId(null);
      
      // Scroll to the form
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setMessage('No previous listing found.');
      setMessageType('error');
    }
  };

  // Handle Edit
  const handleEdit = (listing) => {
    setFormData({
      name: listing.name || '',
      description: listing.description || '',
      quantity: listing.quantity || '',
      servingSize: listing.servingSize || '',
      pickupInstructions: listing.pickupInstructions || '',
      pickupTime: listing.pickupTime || ''
    });
    
    setIsEditing(true);
    setEditingId(listing._id);
    
    // Scroll to the form
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle Delete
  const handleDelete = async (listingId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }
    
    try {
      setLoading(true);
      // Delete the listing
      await axios.delete(`http://localhost:3001/active-listings/${listingId}`);
      
      // Show success message
      setMessage('Listing deleted successfully.');
      setMessageType('success');
      
      // Refresh active listings
      fetchActiveListings();
      
      // If currently editing this listing, reset the form
      if (editingId === listingId) {
        setFormData(initialFormData);
        setIsEditing(false);
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      setMessage('Failed to delete listing.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    setFormData(initialFormData);
    setIsEditing(false);
    setEditingId(null);
  };

  // Handle share via WhatsApp
  const handleShare = (listing) => {
    const text = `Check out this food surplus: ${listing.name} - ${listing.description}. Quantity: ${listing.quantity}, Pickup: ${listing.pickupInstructions} at ${listing.pickupTime}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section with welcome message */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-600 text-white p-6 rounded-b-lg shadow-md mb-6"
      >
        <div className="container mx-auto">
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              <p className="ml-2">Loading user data...</p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">List Food Surplus </h1>
              {userName && <h2 className="text-xl">Welcome, {userName}!</h2>}
            </div>
          )}
        </div>
      </motion.div>

      <div className="container mx-auto px-4 pb-12">
        {/* Message notifications */}
        <AnimatePresence>
          {message && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 mb-6 rounded-lg ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
            >
              <div className="flex items-center justify-between">
                <p>{message}</p>
                <button 
                  onClick={() => setMessage('')}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              
              {whatsappLink && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2"
                >
                  <a 
                    href={whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors "
                  >
                    <FaWhatsapp /> Share on WhatsApp
                  </a>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div 
            ref={formRef}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-bold mb-6 text-green-700 border-b pb-2">
              {isEditing ? 'Edit Surplus Item' : 'List New Surplus Item'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaUtensils className="text-green-600" /> Item Name
                </label>
                <div className="relative" ref={el => (inputRefs.current.food = el)}>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="E.g., Paneer Tikka, Egg Omelette"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                  
                  {/* Food suggestions dropdown */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
                        <div
                          key={index}
                          className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleDropdownSelect('name', suggestion.name)}
                        >
                          {suggestion.image && (
                            <img 
                              src={suggestion.image} 
                              alt={suggestion.name} 
                              className="w-10 h-10 object-cover rounded-full mr-2"
                            />
                          )}
                          <span>{suggestion.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaClipboardList className="text-green-600" /> Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="E.g., Fresh Paneer Tikka, perfect for quick meals."
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <FaWeightHanging className="text-green-600" /> Quantity
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="E.g., 10 kg"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <FaConciergeBell className="text-green-600" /> Serving Size
                  </label>
                  <input
                    type="text"
                    name="servingSize"
                    value={formData.servingSize}
                    onChange={handleChange}
                    placeholder="E.g., Serves 1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaMapMarkerAlt className="text-green-600" /> Pickup Instructions
                </label>
                <input
                  type="text"
                  name="pickupInstructions"
                  value={formData.pickupInstructions}
                  onChange={handleChange}
                  placeholder="E.g., Pickup at 123 Street, 9 AM"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-medium">
                  <FaClock className="text-green-600" /> Pickup Time
                </label>
                <input
                  type="text"
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleChange}
                  placeholder="E.g., 2 PM"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="submit" 
                  className="w-full !bg-green-600 !hover:bg-green-700 !text-white !font-medium py-3 px-6 rounded-lg !transition-colors !flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="!animate-spin h-5 w-5 border-2 !border-white !border-t-transparent rounded-full"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>{isEditing ? 'Update Listing' : 'List Surplus'}</>
                  )}
                </button>
                
                {(isEditing || formData.name) && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="mt-4 border-t pt-4">
              <button 
                type="button" 
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors"
                onClick={handleViewPreviousListing}
              >
                <FaHistory /> View Previous Listing
              </button>
            </div>
          </motion.div>

          {/* Active Listings Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-bold mb-6 text-green-700 border-b pb-2">Active Surplus Listings</h2>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
              </div>
            ) : activeListings.length > 0 ? (
              <div className="space-y-4">
                {activeListings.map((listing) => (
                  <motion.div 
                    key={listing._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-bold text-green-700">{listing.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{listing.description}</p>
                        
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                          <div className="flex items-center gap-1">
                            <FaWeightHanging className="text-green-600" />
                            <span><strong>Quantity:</strong> {listing.quantity}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaConciergeBell className="text-green-600" />
                            <span><strong>Serves:</strong> {listing.servingSize}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-green-600" />
                            <span><strong>Pickup:</strong> {listing.pickupInstructions}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaClock className="text-green-600" />
                            <span><strong>Time:</strong> {listing.pickupTime}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex md:flex-col justify-end gap-2 md:border-l md:pl-3">
                        <button 
                          onClick={() => handleEdit(listing)}
                          className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded transition-colors"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(listing._id)}
                          className="flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 py-2 px-3 rounded transition-colors"
                        >
                          <FaTrashAlt /> Delete
                        </button>
                        <button 
                          onClick={() => handleShare(listing)}
                          className="flex items-center gap-1 bg-green-50 hover:bg-green-100 text-green-700 py-2 px-3 rounded transition-colors"
                        >
                          <FaShare /> Share
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <FaClipboardList className="text-4xl mb-2" />
                <p>No active surplus listings available.</p>
                <p className="text-sm">Start by adding a new surplus item.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default SurplusList;