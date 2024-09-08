// src/components/HomePage.js
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Switch, Container, Typography, Button, Box } from '@mui/material';

const HomePage = () => {
  const { authToken, logout, darkMode, toggleDarkMode } = useContext(AuthContext);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    if (tokenExpiration) {
      const remainingTime = tokenExpiration - new Date().getTime();
      setTimeLeft(remainingTime / 1000); // time left in seconds
    }

    const interval = setInterval(() => {
      const remainingTime = tokenExpiration - new Date().getTime();
      if (remainingTime <= 0) {
        clearInterval(interval);
        logout();
      } else {
        setTimeLeft(remainingTime / 1000); // Update time left
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [authToken, logout]);

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: '5vh',
        textAlign: 'center',
        backgroundColor: darkMode ? '#333' : '#fff',
        color: darkMode ? '#fff' : '#000',
        height: '100vh',
        padding: '2rem',
      }}
    >
      <Typography variant="h2" sx={{ mb: '4vh', fontWeight: 'bold' }}>
        Welcome to BlogIT
      </Typography>
      <Box
        sx={{
          height: '2px',
          background: 'linear-gradient(to right, grey, grey, transparent)',
          mb: '4vh',
        }}
      />
      {authToken ? (
        <Box>
          <Typography variant="body1">You are logged in with token: {authToken}</Typography>
          <Typography variant="body1">Time left until logout: {Math.floor(timeLeft)} seconds</Typography>
          <Button variant="contained" color="primary" onClick={logout} sx={{ mt: '2vh' }}>
            Logout
          </Button>
        </Box>
      ) : (
        <Typography variant="body1">Please login</Typography>
      )}
      {/* Dark mode toggle */}
      <Box sx={{ mt: '4vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="body2" sx={{ mr: '1rem' }}>
          Toggle Dark Mode
        </Typography>
        <Switch checked={darkMode} onChange={toggleDarkMode} />
      </Box>
    </Container>
  );
};

export default HomePage;
