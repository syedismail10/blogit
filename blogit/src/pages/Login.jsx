import { useState, useContext } from 'react';
import { Box, Button, TextField, Typography, IconButton, Switch } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';  // Assuming AuthContext is in this path

const Login = ({ darkMode, toggleDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);  // Get the login function from AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Here you should add your login API call logic
    try {
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.expiresIn);  // Call login from AuthContext
        navigate('/dashboard');  // Redirect after successful login
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error', error);
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
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: '400px' }}>
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
          Login
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
