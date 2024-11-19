import { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, IconButton, Switch } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // Assuming AuthContext is in this path
import { VITE_API_URL } from '../config';
import { useTitle } from '../services/useTitle';
import { useThemeContext } from '../contexts/ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(''); // State for OTP
  const [isOtpSent, setIsOtpSent] = useState(false); // Track if OTP is sent
  const { login } = useContext(AuthContext); // Get the login function from AuthContext
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useThemeContext();

  useTitle("Admin Login | BlogIt");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch(`${VITE_API_URL}/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        // Check the response status
        if (response) {
            const res = await response.json();
            if (res.code==200) {
                // User is verified, proceed with login
                console.log(res.data.token);
                login(res.data.token); // Call login from AuthContext
                navigate('/admin-dashboard'); // Redirect after successful login
        } else {
            // Handle specific status codes
            if (response.status == 401) {
                toast.error('Invalid credentials. Please check your email and password.');
            } else if (response.status === 400) {
                toast.error('Bad request. Please verify your input.');
            
            } else if (response.status==310) {
            // User is not verified, show OTP input
            setIsOtpSent(true);
        }
             else {
              toast.error('An error occurred. Please try again later.');
          }
        }
      }
    }
     catch (error) {
        console.error('Login error', error);
        toast.error('An error occurred while logging in. Please try again later.');
    }
};


  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${VITE_API_URL}/user/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }), // Send OTP for verification
      });
      const res = await response.json();
      if (response.ok) {
        if (res.code == 200){
          alert('OTP Verified successfully!')
          setIsOtpSent(false)
          
        } else {
          toast.error('Invalid OTP. Please try again.'); // Handle invalid OTP
        }
      } else {
        if(res.message === 'User already verified'){
          toast.error('OTP already verified')
          setIsOtpSent(false)
        }
        else{
          toast.error('OTP verification failed.');
        }
      }
    } catch (error) {
      console.error('OTP verification error', error);
    }
  };

  return (
    <>
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
          minHeight: '80vh',
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
          Admin Login
        </Typography>
        <Box component="form" onSubmit={isOtpSent ? handleOtpSubmit : handleSubmit} sx={{ width: '100%', maxWidth: '400px' }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
          />
          {isOtpSent && (
            <TextField
              label="Enter OTP"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              fullWidth
              required
              sx={{ mb: 3 }}
            />
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mb: 2,
              backgroundColor: darkMode ? '#fff' : '#000',
              color: darkMode ? '#000' : '#fff',
              '&:hover': {
                backgroundColor: darkMode ? '#f0f0f0' : '#333',
              },
            }}
          >
            {isOtpSent ? 'Verify OTP' : 'Login'}
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default AdminLogin;
