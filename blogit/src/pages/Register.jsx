import React, { useState } from 'react';
import { Box, Button, TextField, Typography, IconButton, Switch } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link } from 'react-router-dom';

const Register = ({ darkMode, toggleDarkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
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
        Register
      </Typography>
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
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Box>

      {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mt: 4 }}>
        <IconButton onClick={toggleDarkMode} sx={{ color: darkMode ? '#fff' : '#000' }}>
          {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <Switch checked={darkMode} onChange={toggleDarkMode} />
      </Box> */}
    </Box>
  );
};

export default Register;
