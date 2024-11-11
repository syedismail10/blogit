import axios from 'axios';
import { useState } from 'react';
import { Box, Button, TextField, Typography, IconButton, Switch } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link } from 'react-router-dom';

import { VITE_API_URL } from '../config';

const Register = ({ darkMode, toggleDarkMode }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        `{VITE_API_URL}/user/signup`,
        {
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json', // Ensure Content-Type is application/json
          },
        }
      );
  
      console.log(response.data); // Log the response for debugging
  
      if (response.data) {
        setIsOtpSent(true);
        alert('OTP has been sent to your email');
      }
    } catch (error) {
      if (error.response) {
        // Server responded with an error status code
        console.error('Error response:', error.response.data);
        alert(`Registration failed: ${error.response.data.message || 'Bad Request'}`);
      } else {
        // Other errors (network issues, etc.)
        console.error('Error:', error.message);
        alert('Registration failed');
      }
    }
  };
  

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    try {
      // Verify OTP by making another API call
      const response = await axios.post('VITE_API_URL/user/verify-otp', {
        email: formData.email,
        otp: otp,
      });

      if (response.status == 200) {
        alert('User successfully verified!');
        // Redirect to login or home page after successful verification
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      alert('OTP verification failed');
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: darkMode ? '#333' : '#fff',
        color: darkMode ? '#fff' : '#000',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <Typography variant="h4" sx={{ mb: 3 }}>
        {isOtpSent ? 'Verify OTP' : 'Register'}
      </Typography>
      
      {!isOtpSent ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: '400px' }}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 3 }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 3 }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mb: 2, backgroundColor: darkMode ? '#fff' : '#000', color: darkMode ? '#000' : '#fff' }}
          >
            Register
          </Button>
        </Box>
      ) : (
        <Box component="form" onSubmit={handleOtpVerification} sx={{ width: '100%', maxWidth: '400px' }}>
          <TextField
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mb: 2, backgroundColor: darkMode ? '#fff' : '#000', color: darkMode ? '#000' : '#fff' }}
          >
            Verify OTP
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Register;
