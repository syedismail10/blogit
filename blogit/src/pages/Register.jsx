import axios from 'axios';
import { useState } from 'react';
import { Box, Button, TextField, Typography, IconButton, Switch } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import { VITE_API_URL } from '../config';
import { useTitle } from '../services/useTitle';
import { useThemeContext } from '../contexts/ThemeContext';
import LoadingModal from '../components/LoadingModal';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useTitle("Register | BlogIt");

  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { darkMode, toggleDarkMode } = useThemeContext();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await axios.post(
        `${VITE_API_URL}/user/signup`,
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
        toast.info('OTP has been sent to your email');
      }
    } catch (error) {
      if (error.response) {
        // Server responded with an error status code
        console.error('Error response:', error.response.data);
        toast.error(`Registration failed: ${error.response.data.message || 'Bad Request'}`);
      } else {
        // Other errors (network issues, etc.)
        console.error('Error:', error.message);
        toast.error('Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Verify OTP by making another API call
      const response = await axios.post(`${VITE_API_URL}/user/verify-otp`, {
        email: formData.email,
        otp: otp,
      });

      if (response.status == 200) {
        alert('User successfully verified, now log in!');
        // Redirect to login or home page after successful verification
        navigate('/login');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      toast.error('OTP verification failed');
    } finally {
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  return (
    <>
      <LoadingModal isOpen={isLoading}/>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        transition: Bounce
      />
      <Box
        sx={{
          backgroundColor: darkMode ? '#121212' : '#fff',
          color: darkMode ? '#fff' : '#000',
          minHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            marginBottom: '30px', 
            fontWeight: 800, 
            fontFamily: '"Besley", serif' 
          }}
        >
          {isOtpSent ? 'Verify OTP' : 'Register'}
        </Typography>
        <Typography variant="p" sx={{ mb: 3 }}>
          Join the world of bloggers today!
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
            <Typography>
            Already have an account?
              <Link 
                to="/login" 
                style={{
                  color: darkMode ? '#fff' : '#000', 
                  fontWeight: 'bold',
                  marginLeft: '6px',
                  textDecoration: 'underline',
                }}
              >
                Login
              </Link>
            </Typography>
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
    </>
  );
};

export default Register;
