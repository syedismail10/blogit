import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Switch, IconButton } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // Ensure the correct path
import {useThemeContext} from '../contexts/ThemeContext';   // Ensure the correct path

const Navbar = () => {
  const { authToken, logout } = useContext(AuthContext); // This should now be defined
  const { darkMode, toggleDarkMode } = useThemeContext();

  return (
    <AppBar position="static" sx={{ backgroundColor: darkMode ? '#000' : '#fff', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between', padding: '10px' }}>
        <Typography variant="h6" sx={{ color: darkMode ? '#fff' : '#000', fontWeight: 'bold' }}>
          {authToken ? 'Username' : 'Guest'}
        </Typography>
        <Box sx={{ display: 'flex', gap: '20px' }}>
        <Button component={Link} to="/blog" sx={{ color: darkMode ? '#fff' : '#000', textTransform: 'none' }}>
            Browse Blogs
          </Button>
          <Button component={Link} to="/feed" sx={{ color: darkMode ? '#fff' : '#000', textTransform: 'none' }}>
            Feed
          </Button>
          {authToken && (
            <Button component={Link} to="/create-blog" sx={{ color: darkMode ? '#fff' : '#000', textTransform: 'none' }}>
              Create Blog
            </Button>
          )}
          <Button component={Link} to="/about" sx={{ color: darkMode ? '#fff' : '#000', textTransform: 'none' }}>
            About
          </Button>
          {authToken ? (
            <Button onClick={logout} sx={{ color: darkMode ? '#fff' : '#000', textTransform: 'none' }}>
              Logout
            </Button>
          ) : (
            <Button component={Link} to="/login" sx={{ color: darkMode ? '#fff' : '#000', textTransform: 'none' }}>
              Login
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <IconButton onClick={toggleDarkMode} sx={{ color: darkMode ? '#fff' : '#000' }} aria-label="toggle dark mode">
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Switch checked={darkMode} onChange={toggleDarkMode} inputProps={{ 'aria-label': 'toggle dark mode switch' }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
