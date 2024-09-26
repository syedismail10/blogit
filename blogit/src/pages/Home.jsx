import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Switch, Container, Typography, Button, Box } from '@mui/material';
import NavBar from '../components/Navbar'; // Import the NavBar component

const HomePage = () => {
  const { authToken, logout, darkMode, toggleDarkMode } = useContext(AuthContext);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const tokenExpiration = Number(localStorage.getItem('tokenExpiration')); // Convert to number
    if (tokenExpiration) {
      const remainingTime = tokenExpiration - new Date().getTime();
      if (remainingTime > 0) {
        setTimeLeft(remainingTime / 1000); // Set time left in seconds
      } else {
        logout(); // Logout if the token has already expired
      }
    }

    const interval = setInterval(() => {
      const remainingTime = tokenExpiration - new Date().getTime();
      if (remainingTime <= 0) {
        clearInterval(interval);
        logout(); // Auto logout if time is up
      } else {
        setTimeLeft(remainingTime / 1000); // Update time left in seconds
      }
    }, 1000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [authToken, logout]);

  return (
    <>
      <NavBar /> {/* Add the NavBar at the top */}
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
            <Typography variant="body1">
              Time left until logout: {Math.floor(timeLeft)} seconds
            </Typography>
            <Button variant="contained" color="primary" onClick={logout} sx={{ mt: '2vh' }}>
              Logout
            </Button>
          </Box>
        ) : (
          <Typography variant="body1">Please log in to access your account.</Typography>
        )}
      </Container>
    </>
  );
};

export default HomePage;
