import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NGOLogin = () => {
     const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login'); // 'login', 'donorSignup', 'ngoSignup'
  const [isFlipping, setIsFlipping] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [generatedCaptcha, setGeneratedCaptcha] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Form data states
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [donorData, setDonorData] = useState({
    firstName: '',
    lastName: '',
    addressLine1: '',
    city: '',
    streetName: '',
    phoneNo: '',
    companyPhoneNo: '',
    email: '',
    password: '',
    confirmPassword: '',
    captcha: ''
  });

  const [ngoData, setNgoData] = useState({
    organizationName: '',
    location: '',
    phoneNo: '',
    email: '',
    password: '',
    confirmPassword: '',
    captcha: ''
  });

  // Function to generate random CAPTCHA
  const generateCaptcha = () => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
      captcha += chars[Math.floor(Math.random() * chars.length)];
    }
    setGeneratedCaptcha(captcha);
  };

  // Generate a new CAPTCHA when the component mounts or when switching to signup forms
  useEffect(() => {
    if (activeTab !== 'login') {
      generateCaptcha();
    }
  }, [activeTab]);

  // Handle tab switch with animation
  const switchTab = (tab) => {
    setIsFlipping(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsFlipping(false);
    }, 500);
    setErrorMessage('');
    setCaptchaError('');
    setPasswordError('');
  };

  const apiUrl = window.location.hostname === "localhost" 
  ? "http://localhost:3001/login"   // Localhost for desktop
  : `https://${window.location.hostname}/login`; // Ngrok URL for mobil


  // Handle form input changes
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDonorChange = (e) => {
    const { name, value } = e.target;
    setDonorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNgoChange = (e) => {
    const { name, value } = e.target;
    setNgoData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation functions
  const validatePasswords = (data) => {
    if (data.password !== data.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-z][a-z0-9._-]*@[a-z0-9.-]+\.[a-z]{2,}$/;
    return emailRegex.test(email);
  };

  // Handle form submissions (in a real app, these would connect to backend APIs)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
        console.log('Form data:', loginData);
        

        // Send the POST request to login
        axios.post(apiUrl, loginData,{ withCredentials: true }) 
        .then(result => {
        console.log('Login response:', result);

        // Check the response structure
        if (result.data && result.data.message === 'Login successful to NGO') {
            navigate('/home');
        } else if (result.data && result.data.message === 'Lessgo') {
            navigate('/donor-home');
        } else {
            // Handle unexpected messages or responses
            setErrorMessage('Unexpected response from the server.');
        }
    })
    .catch(err => {
        if (err.response) {
            // Handle error responses
            if (err.response.status === 401) {
                setErrorMessage('Incorrect password');
            } else if (err.response.status === 404) {
                setErrorMessage('User not found');
            } else {
                setErrorMessage('An error occurred. Please try again later.');
            }
        } else if (err.request) {
            // Handle network errors
            setErrorMessage('Failed to connect to the server. Please check your connection.');
        } else {
            // Handle any other errors
            setErrorMessage('An unexpected error occurred.');
        }

        console.error('Login error:', err);
    });

  };

  const handleDonorSubmit = (e) => {
    e.preventDefault();

    // Validate CAPTCHA
    if (donorData.captcha !== generatedCaptcha) {
      setCaptchaError('CAPTCHA does not match');
      return;
    } else {
      setCaptchaError('');
    }

    // Validate password
    if (!validatePasswords(donorData)) {
      return;
    }

    // Validate email format
    if (!isValidEmail(donorData.email)) {
      setErrorMessage("Please enter a valid email address. It must start with a lowercase letter and follow the correct email format.");
      return;
    }
     // Concatenate address fields to create a single location string
     const location = `${donorData.addressLine1}, ${donorData.city}, ${donorData.streetName}`;
     const donorDatatoSubmit = {
        ...donorData,
        location, // Add the concatenated location to the formData
        addressLine1: undefined,
        city: undefined,
        streetName: undefined
    };

            // Send data to the backend
            axios.post('http://localhost:3001/register', donorDatatoSubmit)
            .then(result => {
                console.log(result);
                navigate('/login');
            })
            .catch(err => console.log(err));

    // For demo purposes, we'll just show success
    alert(`Donor registration successful for ${donorData.firstName} ${donorData.lastName}`);
    switchTab('login');
  };

  const handleNgoSubmit = (e) => {
    e.preventDefault();
    
    // Validate CAPTCHA
    if (ngoData.captcha !== generatedCaptcha) {
      setCaptchaError('CAPTCHA does not match');
      return;
    } else {
      setCaptchaError('');
    }

    // Validate password
    if (!validatePasswords(ngoData)) {
      return;
    }

    // Validate email format
    if (!isValidEmail(ngoData.email)) {
      setErrorMessage("Please enter a valid email address. It must start with a lowercase letter and follow the correct email format.");
      return;
    }
    axios.post('http://localhost:3001/register-ngo', ngoData) // Use appropriate endpoint
    .then(result => {
        console.log(result);
        navigate('/login');
    })
    .catch(err => console.log(err));

    // For demo purposes, we'll just show success
    alert(`NGO registration successful for ${ngoData.organizationName}`);
    switchTab('login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4">
      <div className={`relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-500 ${isFlipping ? 'scale-95 opacity-70' : 'scale-100 opacity-100'}`}>
        
        {/* Tab Navigation */}
        <div className="flex w-full bg-gray-100 rounded-t-xl overflow-hidden">
          <button
            className={`flex-1 py-4 text-lg font-medium transition-all duration-300 ${activeTab === 'login' ? '!bg-blue-500 text-white shadow-md' : '!bg-gray-100 !text-gray-600 hover:bg-gray-200'}`}
            onClick={() => switchTab('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-4 text-lg font-medium transition-all duration-300 ${activeTab === 'donorSignup' ? '!bg-green-500 text-white shadow-md' : '!bg-gray-100 !text-gray-600 hover:bg-gray-200'}`}
            onClick={() => switchTab('donorSignup')}
          >
            Donor Signup
          </button>
          <button
            className={`flex-1 py-4 text-lg font-medium transition-all duration-300 ${activeTab === 'ngoSignup' ? '!bg-purple-500 text-white shadow-md' : '!bg-gray-100 text-gray-600 !hover:bg-gray-200'}`}
            onClick={() => switchTab('ngoSignup')}
          >
            NGO Signup
          </button>
        </div>

        {/* Form Container with Animation */}
        <div className={`transition-all duration-500 transform ${isFlipping ? 'rotate-y-90' : 'rotate-y-0'}`} style={{transformStyle: 'preserve-3d'}}>
          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit}> 
            <div className="p-8 animate-fadeIn">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Welcome Back</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                {errorMessage && (
                  <div className="text-red-500 text-sm font-medium mt-2">{errorMessage}</div>
                )}
                
                <button
                 type="submit"  // This is important!
                  onClick={handleLoginSubmit}
                  className="w-full !bg-blue-500 text-white py-3 rounded-lg font-medium hover:!bg-blue-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Login
                </button>
                
                <div className="mt-4 text-center text-gray-600">
                  <p>Don't have an account? Choose a signup option above.</p>
                </div>
              </div>
            </div></form>
          )}

          {/* Donor Signup Form */}
          {activeTab === 'donorSignup' && (
            <div className="p-8 animate-fadeIn">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Donor Registration</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={donorData.firstName}
                      onChange={handleDonorChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="First Name"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={donorData.lastName}
                      onChange={handleDonorChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Last Name"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={donorData.addressLine1}
                    onChange={handleDonorChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Address Line 1"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      name="city"
                      value={donorData.city}
                      onChange={handleDonorChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Street Name</label>
                    <input
                      type="text"
                      name="streetName"
                      value={donorData.streetName}
                      onChange={handleDonorChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Street Name"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="text"
                      name="phoneNo"
                      value={donorData.phoneNo}
                      onChange={handleDonorChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Phone Number"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Company Phone</label>
                    <input
                      type="text"
                      name="companyPhoneNo"
                      value={donorData.companyPhoneNo}
                      onChange={handleDonorChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Company Phone"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={donorData.email}
                    onChange={handleDonorChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Email"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={donorData.password}
                      onChange={handleDonorChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Password"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={donorData.confirmPassword}
                      onChange={handleDonorChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Confirm Password"
                      required
                    />
                  </div>
                </div>
                
                {passwordError && (
                  <div className="text-red-500 text-sm font-medium">{passwordError}</div>
                )}
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">CAPTCHA Verification</label>
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 px-3 py-2 rounded-lg border border-gray-300 select-none font-mono text-lg tracking-wider inline-block min-w-32 text-center italic bg-opacity-60"
                         style={{
                           transform: `rotate(${Math.floor(Math.random() * 10) - 5}deg) skew(${Math.floor(Math.random() * 5)}deg)`,
                           backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`
                         }}>
                      {generatedCaptcha}
                    </div>
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      ↻
                    </button>
                  </div>
                  <input
                    type="text"
                    name="captcha"
                    value={donorData.captcha}
                    onChange={handleDonorChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter CAPTCHA"
                    required
                  />
                  {captchaError && (
                    <div className="text-red-500 text-sm font-medium">{captchaError}</div>
                  )}
                </div>
                
                {errorMessage && (
                  <div className="text-red-500 text-sm font-medium">{errorMessage}</div>
                )}
                
                <button
                  onClick={handleDonorSubmit}
                  className="w-full !bg-green-500 text-white py-3 rounded-lg font-medium hover:!bg-green-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign Up as Donor
                </button>
              </div>
            </div>
          )}

          {/* NGO Signup Form */}
          {activeTab === 'ngoSignup' && (
            <div className="p-8 animate-fadeIn">
              <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">NGO Registration</h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Organization Name</label>
                  <input
                    type="text"
                    name="organizationName"
                    value={ngoData.organizationName}
                    onChange={handleNgoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Organization Name"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={ngoData.location}
                    onChange={handleNgoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Location"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="text"
                    name="phoneNo"
                    value={ngoData.phoneNo}
                    onChange={handleNgoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Phone Number"
                    required
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={ngoData.email}
                    onChange={handleNgoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Email"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={ngoData.password}
                      onChange={handleNgoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Password"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={ngoData.confirmPassword}
                      onChange={handleNgoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Confirm Password"
                      required
                    />
                  </div>
                </div>
                
                {passwordError && (
                  <div className="text-red-500 text-sm font-medium">{passwordError}</div>
                )}
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">CAPTCHA Verification</label>
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 px-3 py-2 rounded-lg border border-gray-300 select-none font-mono text-lg tracking-wider inline-block min-w-32 text-center italic bg-opacity-60"
                         style={{
                           transform: `rotate(${Math.floor(Math.random() * 10) - 5}deg) skew(${Math.floor(Math.random() * 5)}deg)`,
                           backgroundColor: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`
                         }}>
                      {generatedCaptcha}
                    </div>
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      ↻
                    </button>
                  </div>
                  <input
                    type="text"
                    name="captcha"
                    value={ngoData.captcha}
                    onChange={handleNgoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter CAPTCHA"
                    required
                  />
                  {captchaError && (
                    <div className="text-red-500 text-sm font-medium">{captchaError}</div>
                  )}
                </div>
                
                {errorMessage && (
                  <div className="text-red-500 text-sm font-medium">{errorMessage}</div>
                )}
                
                <button
                  onClick={handleNgoSubmit}
                  className="w-full !bg-purple-500 text-white py-3 rounded-lg font-medium hover:!bg-purple-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign Up as NGO
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-2">
          <div className={`h-full transition-all duration-500 ${
            activeTab === 'login' ? 'bg-blue-500' : 
            activeTab === 'donorSignup' ? 'bg-green-500' : 
            'bg-purple-500'
          }`}></div>
        </div>
      </div>
      
      {/* Social Media Icons (Decorative) */}
      {activeTab === 'login' && (
        <div className="mt-6 flex space-x-4 justify-center">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 cursor-pointer transition-all">f</div>
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white hover:bg-red-700 cursor-pointer transition-all">g</div>
          <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500 cursor-pointer transition-all">t</div>
        </div>
      )}
      
      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .rotate-y-90 {
          transform: rotateY(90deg);
        }
        .rotate-y-0 {
          transform: rotateY(0deg);
        }
      `}</style>
    </div>
  );
};

export default NGOLogin;