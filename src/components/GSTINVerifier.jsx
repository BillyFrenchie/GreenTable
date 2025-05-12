import React, { useState } from 'react';

function GSTINVerifier() {
  const [gstin, setGstin] = useState('');
  const [error, setError] = useState(null);

  const handleRedirect = () => {
    // Validate GSTIN format using regex
    if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/.test(gstin)) {
      setError('❌ Invalid GSTIN format.');
      return;
    }

    // Redirect to ClearTax GSTIN search page with the GSTIN
    const url = `https://cleartax.in/gst-number-search/?gstin=${gstin}`;
    window.location.href = url;  // Redirects the user to the URL
  };

  return (
    <div className="!max-w-xl !mx-auto !p-6 !bg-white !rounded-xl !shadow-xl !space-y-6 !w-full">
      <h2 className="!text-3xl !font-bold !text-center !text-emerald-700">GSTIN Verifier</h2>

      <div className="!flex !flex-col !space-y-4">
        <label className="!font-semibold !text-gray-700 !text-lg">Enter GSTIN</label>
        <input
          type="text"
          maxLength={15}
          value={gstin}
          onChange={(e) => setGstin(e.target.value.toUpperCase())}
          className="!p-3 !border-2 !border-emerald-600 !rounded-lg !focus:outline-none !focus:ring-2 !focus:ring-emerald-500 !text-lg !font-mono"
          placeholder="22AAAAA0000A1Z5"
        />
        <button
          onClick={handleRedirect}
          className="!bg-emerald-600 !text-white !font-semibold !py-3 !px-6 !rounded-lg !hover:bg-emerald-700 !transition-all !duration-300"
        >
          Search GSTIN
        </button>
      </div>

      {error && (
        <div className="!bg-red-100 !text-red-700 !p-4 !rounded-lg !text-lg !font-medium !text-center">
          {error}
        </div>
      )}
    </div>
  );
}

export default GSTINVerifier;


















// import React, { useState } from 'react';
// import './NGOLogin.css';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';

// function NGOLogin() {
//     const [errorMessage, setErrorMessage] = useState(''); // For error messages
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         email: '',
//         password: ''
//     });

//     // Handle form input changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value
//         }));
//     };

//     // Handle form submission
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log('Form data:', formData);
        

//         // Send the POST request to login
//         axios.post('http://localhost:3001/login', formData,{ withCredentials: true }) 
//         .then(result => {
//         console.log('Login response:', result);

//         // Check the response structure
//         if (result.data && result.data.message === 'Login successful to NGO') {
//             navigate('/home');
//         } else if (result.data && result.data.message === 'Lessgo') {
//             navigate('/donor-home');
//         } else {
//             // Handle unexpected messages or responses
//             setErrorMessage('Unexpected response from the server.');
//         }
//     })
//     .catch(err => {
//         if (err.response) {
//             // Handle error responses
//             if (err.response.status === 401) {
//                 setErrorMessage('Incorrect password');
//             } else if (err.response.status === 404) {
//                 setErrorMessage('User not found');
//             } else {
//                 setErrorMessage('An error occurred. Please try again later.');
//             }
//         } else if (err.request) {
//             // Handle network errors
//             setErrorMessage('Failed to connect to the server. Please check your connection.');
//         } else {
//             // Handle any other errors
//             setErrorMessage('An unexpected error occurred.');
//         }

//         console.error('Login error:', err);
//     });

//     };

//     return (
//         <div className="container-l">
//             <h2>Login</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                     <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         placeholder="Email ID"
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <input
//                         type="password"
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         placeholder="Password"
//                         required
//                     />
//                 </div>
//                 <div className="error-message" style={{ color: 'red' }}>
//                     {errorMessage}
//                 </div>

//                 <button type="submit" className="continue-button">
//                     Login
//                 </button>
                
               
//             </form>
//             <Link to='/register'><button type="submit" className="continue-button">
//                     SignUp
//                 </button></Link>
            
               
//         </div>
//     );
// }

// export default NGOLogin;

