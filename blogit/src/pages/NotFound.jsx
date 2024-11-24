import React from 'react';
import { Box, Typography, Button, IconButton, Switch } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link } from 'react-router-dom';
import { useTitle } from '../services/useTitle';
import { useThemeContext } from '../contexts/ThemeContext';

const NotFound = () => {
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
          variant="h1" 
          gutterBottom 
          sx={{ 
            marginBottom: '30px', 
            fontWeight: 800, 
            fontFamily: '"Besley", serif' 
          }}
        >
          404
        </Typography>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Oops! Page not found.
      </Typography>
      <Button
        component={Link}
        to="/"
        variant="contained"
        color="primary"
        sx={{ textTransform: 'none', mb: 3, backgroundColor: darkMode ? '#fff' : '#000', color: darkMode ? '#000' : '#fff' }}
      >
        Go Back to Home
      </Button>
    </Box>
  );
};

export default NotFound;
