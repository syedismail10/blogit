import React from 'react';
import { Box, Typography, Button, IconButton, Switch } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTitle } from '../services/useTitle';
import { useThemeContext } from '../contexts/ThemeContext';

const NotLoggedIn = () => {
  const { darkMode, toggleDarkMode } = useThemeContext();

  useTitle("Oops :(");

  return (
    <Box
      sx={{
        backgroundColor: darkMode ? '#121212' : '#fff',
        color: darkMode ? '#fff' : '#000',
        height: '80vh',
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
          Please Log In!
        </Typography>
      <Typography variant="h5" sx={{ mb: 4 }}>
        Oops! Looks like you're not logged in.
      </Typography>
      <Button
        component={Link}
        to="/login"
        variant="contained"
        color="primary"
        sx={{ textTransform: 'none', mb: 3, backgroundColor: darkMode ? '#fff' : '#000', color: darkMode ? '#000' : '#fff' }}
      >
        Login
      </Button>
    </Box>
  );
};

export default NotLoggedIn;
