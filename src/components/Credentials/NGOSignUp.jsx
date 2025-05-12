// NGOSignUp.js
import React, { useState } from 'react';
import './NGOSignUp.css'; // Reusing the same CSS file
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function NGOSignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        organizationName: '',
        location: '',
        phoneNo: '',
        email: '',
        password: '',
        confirmPassword: '',
        captcha: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;console.log(value)
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/register-ngo', formData) // Use appropriate endpoint
            .then(result => {
                console.log(result);
                navigate('/login');
            })
            .catch(err => console.log(err));
            console.log(formData);
    };

    return (
        <div className="container-n">
            <h2>NGO Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="text" name="organizationName" value={formData.organizationName} onChange={handleChange} placeholder="Organization Name" required />
                </div>
                <div className="form-group">
                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
                </div>
                <div className="form-group">
                    <input type="text" name="phoneNo" value={formData.phoneNo} onChange={handleChange} placeholder="Phone No." required />
                </div>
                <div className="form-group">
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email ID" required />
                </div>
                <div className="form-group">
                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                </div>
                <div className="form-group">
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Rewrite Password" required />
                </div>
                <div className="form-group">
                    <input type="text" name="captcha" value={formData.captcha} onChange={handleChange} placeholder="Captcha" required />
                </div>
                <div className="social-login">
                    {/* Social Login Icons can be added here */}
                    
                </div>
                <button type="submit" className="continue-button">Sign Up</button>
                <Link to='/login'><button  className="continue-button">Login</button></Link>
                
            </form>
        </div>
    );
}

export default NGOSignUp;
