import React  , { useContext } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Switch } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useContext(AuthContext);

  return (
    <AppBar position="static" sx={{ backgroundColor: darkMode ? '#333' : '#fff', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between', padding: '10px' }}>
        <Typography variant="h6" sx={{ color: darkMode ? '#fff' : '#000', fontWeight: 'bold' }}>
          BlogIT
        </Typography>

        {/* Dark Mode Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={toggleDarkMode} sx={{ color: darkMode ? '#fff' : '#000' }}>
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          <Switch checked={darkMode} onChange={toggleDarkMode} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
