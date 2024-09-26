import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Switch, IconButton } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link } from 'react-router-dom';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: darkMode ? '#333' : '#fff', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between', padding: '10px' }}>
        
        {/* Left side - Brand or Username */}
        <Typography variant="h6" sx={{ color: darkMode ? '#fff' : '#000', fontWeight: 'bold' }}>
          Username
        </Typography>

        {/* Middle - Navigation Links */}
        <Box sx={{ display: 'flex', gap: '20px' }}>
          <Button 
            component={Link} 
            to="/" 
            sx={{ color: darkMode ? '#fff' : '#000', textTransform: 'none' }}
          >
            Blog
          </Button>
          <Button 
            component={Link} 
            to="/create-blog" 
            sx={{ color: darkMode ? '#fff' : '#000', textTransform: 'none' }}
          >
            Create Blog
          </Button>
          <Button 
            component={Link} 
            to="/about" 
            sx={{ color: darkMode ? '#fff' : '#000', textTransform: 'none' }}
          >
            About
          </Button>
          <Button 
            component={Link} 
            to="/login" 
            sx={{ color: darkMode ? '#fff' : '#000', textTransform: 'none' }}
          >
            LoggedIn?
          </Button>
        </Box>

        {/* Right side - Dark/Light Mode Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconButton 
            onClick={toggleDarkMode} 
            sx={{ color: darkMode ? '#fff' : '#000' }}
            aria-label="toggle dark mode"
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Switch 
            checked={darkMode} 
            onChange={toggleDarkMode} 
            inputProps={{ 'aria-label': 'toggle dark mode switch' }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
