import React, { useContext, useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Box, Button, Switch, IconButton, Menu, MenuItem } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {useThemeContext} from '../contexts/ThemeContext';
import { VITE_API_URL } from '../config';
import axios from 'axios';

const Navbar = () => {
  const { authToken, logout } = useContext(AuthContext); // This should now be defined
  const { darkMode, toggleDarkMode } = useThemeContext();
  const [loggedInUserSlug, setLoggedInUserSlug] = useState(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  const location = useLocation();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!authToken) return;

      try {
        const response = await axios.get(`${VITE_API_URL}/user/logged-in-user`, {
          headers: {
            Authorization: `${authToken}`,
          },
        });
        setLoggedInUserSlug(response.data.data.slug);
        const { fullName, role } = response.data.data;
        setName(fullName);
        setRole(role);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [authToken]);

  return (
    <AppBar position="sticky" sx={{ backgroundColor: darkMode ? '#000' : '#fff', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between', padding: '10px' }}>
        <Link to={"/"} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="h6" sx={{ color: darkMode ? '#fff' : '#000', fontWeight: 'bold', }}>
            BlogIt
          </Typography>
        </Link>
        {authToken
          ? (
          <Box sx={{ display: 'flex', gap: '20px' }}>
            {role == "admin" && <Button component={Link} to="/admin-dashboard" sx={{ color: darkMode ? '#fff' : '#000', textTransform: 'none' }}>
              Dashboard
            </Button>}
            <Button component={Link} to="/feed" sx={{ color: darkMode ? '#fff' : '#000', textTransform: 'none' }}>
              Feed
            </Button>
            <Button component={Link} to="/create-blog" variant="contained" color="secondary" sx={{ textTransform: 'none' }}>
              Create Blog
            </Button>
            <Button component={Link} to="/blog" sx={{ color: darkMode ? '#fff' : '#000', textTransform: 'none' }}>
              Browse Blogs
            </Button>
            <Button sx={{ color: darkMode ? '#fff' : '#000', textTransform: 'none' }}
              onClick={handleMenuOpen}
              aria-label="profile dropdown"
            >
              {name}
                <AccountCircleIcon sx={{ marginLeft: '6px' }} />
            </Button>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem component={Link} to={`/user/${loggedInUserSlug}`} onClick={handleMenuClose}>
                View Profile
              </MenuItem>
              <MenuItem component={Link} to="/edit" onClick={handleMenuClose}>
                Edit Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  logout();
                }}
              >
                Sign Out
              </MenuItem>
            </Menu>
          </Box>
        )
        : 
        (
          <Box sx={{ display: 'flex', gap: '20px' }}>
            <Button component={Link} to="/login" sx={{ color: darkMode ? '#fff' : '#000', textTransform: 'none' }}>
              Login
            </Button>
            <Button component={Link} to="/register" sx={{ color: darkMode ? '#fff' : '#000', textTransform: 'none' }}>
              Register
            </Button>
            <Button component={Link} to="/admin-login" sx={{ color: darkMode ? '#fff' : '#000', textTransform: 'none' }}>
              Admin Login
            </Button>
          </Box>
        )}
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
