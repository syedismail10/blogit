import { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, IconButton, Switch } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // Assuming AuthContext is in this path

const Login = ({ darkMode, toggleDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(''); // State for OTP
  const [isOtpSent, setIsOtpSent] = useState(false); // Track if OTP is sent
  const { login } = useContext(AuthContext); // Get the login function from AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:3000/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        // Check the response status
        if (response.ok) {
            const res = await response.json();
            if (res.data.verified) {
                // User is verified, proceed with login
                login(res.data.token); // Call login from AuthContext
                navigate('/dashboard'); // Redirect after successful login
            } else {
                // User is not verified, show OTP input
                setIsOtpSent(true);
            }
        } else {
            // Handle specific status codes
            if (response.status === 401) {
                alert('Invalid credentials. Please check your email and password.');
            } else if (response.status === 400) {
                alert('Bad request. Please verify your input.');
            } else if (response.status ===310) {
              setIsOtpSent(true);
            } else {
              alert('An error occurred. Please try again later.');
          }
        }
    } catch (error) {
        console.error('Login error', error);
        alert('An error occurred while logging in. Please try again later.');
    }
};


  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/user/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }), // Send OTP for verification
      });

      if (response.ok) {
        const res = await response.json();
        if (res.data.message === 'User already verified') {
          // If OTP verification is successful, log the user in
          // login(res.data.token); // Call login from AuthContext
          navigate('/dashboard'); // Redirect after successful login
        } else {
          alert('Invalid OTP. Please try again.'); // Handle invalid OTP
        }
      } else {
        alert('OTP verification failed.');
      }
    } catch (error) {
      console.error('OTP verification error', error);
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
        Login
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
        <Typography>
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mt: 4 }}>
        <IconButton onClick={toggleDarkMode} sx={{ color: darkMode ? '#fff' : '#000' }}>
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <Switch checked={darkMode} onChange={toggleDarkMode} />
      </Box>
    </Box>
  );
};

export default Login;
