import React, { useState, useEffect } from 'react';
import './DonorSignUp.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function DonorSignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
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

    const [generatedCaptcha, setGeneratedCaptcha] = useState('');
    const [captchaError, setCaptchaError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // Function to generate random CAPTCHA
    const generateCaptcha = () => {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += chars[Math.floor(Math.random() * chars.length)];
        }
    
        // Apply random visual effects
        const captchaElement = document.getElementById('captcha');
        if (captchaElement) {
            captchaElement.style.transform = `rotate(${Math.floor(Math.random() * 10) - 5}deg) skew(${Math.floor(Math.random() * 5)}deg)`;
            captchaElement.style.color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Random color
            captchaElement.style.fontFamily = Math.random() > 0.5 ? 'Courier New, Courier, monospace' : 'Comic Sans MS, Comic Sans, cursive';
            captchaElement.style.backgroundColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`; // Random light background color
        }
    
        setGeneratedCaptcha(captcha);
    };
    
    // Generate a new CAPTCHA when the component mounts
    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const validatePasswords = () => {
        if (formData.password !== formData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const isValidEmail = (email) => {
        // Regular expression to ensure the email starts with a lowercase letter
        const emailRegex = /^[a-z][a-z0-9._-]*@[a-z0-9.-]+\.[a-z]{2,}$/;
        return emailRegex.test(email);
    };
    

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate CAPTCHA
        if (formData.captcha !== generatedCaptcha) {
            setCaptchaError('CAPTCHA does not match');
            return;
        } else {
            setCaptchaError('');
        }

        // Validate password
        if (!validatePasswords()) {
            return;
        }
          // Validate email format
    if (!isValidEmail(formData.email)) {
        alert("Please enter a valid email address. It must start with a lowercase letter and follow the correct email format.");
        return;
    }

        // Concatenate address fields to create a single location string
        const location = `${formData.addressLine1}, ${formData.city}, ${formData.streetName}`;

        // Create a new object with the concatenated location
        const dataToSubmit = {
            ...formData,
            location, // Add the concatenated location to the formData
            addressLine1: undefined,
            city: undefined,
            streetName: undefined
        };

        // Send data to the backend
        axios.post('http://localhost:3001/register', dataToSubmit)
            .then(result => {
                console.log(result);
                navigate('/login');
            })
            .catch(err => console.log(err));
        
        console.log(dataToSubmit);
    };

    return (
        <div className="container-d">
            <h2>Donor Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
                </div>
                <div className="form-group">
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
                </div>
                <div className="form-group">
                    <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="Address Line 1" required />
                </div>
                <div className="form-group">
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
                </div>
                <div className="form-group">
                    <input type="text" name="streetName" value={formData.streetName} onChange={handleChange} placeholder="Street Name" />
                </div>
                <div className="form-group">
                    <input type="text" name="phoneNo" value={formData.phoneNo} onChange={handleChange} placeholder="Phone No." required />
                </div>
                <div className="form-group">
                    <input type="text" name="companyPhoneNo" value={formData.companyPhoneNo} onChange={handleChange} placeholder="Company Phone No." required />
                </div>
                <div className="form-group">
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email ID" required />
                </div>
                <div className="form-group">
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                </div>
                <div className="form-group">
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Rewrite Password" required />
                    {passwordError && <p className="error-text">{passwordError}</p>}
                </div>

                <div className="form-group">
                    <input type="text" name="captcha" value={formData.captcha} onChange={handleChange} placeholder="Enter CAPTCHA" required />
                    {captchaError && <p className="error-text">{captchaError}</p>}
                </div>

                <div className="captcha-container">
                    <span id="captcha" className="captcha-text complex">{generatedCaptcha}</span>
                    <button type="button" onClick={generateCaptcha}>Refresh</button>
                </div>

                <button type="submit" className="continue-button">Sign Up</button>

                <div className="switch-tab">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                    <p>Sign Up as <Link to="/register-ngo">NGO</Link></p>
                </div>
            </form>
        </div>
    );
}

export default DonorSignUp;
