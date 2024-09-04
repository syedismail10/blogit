import { useState } from 'react';
import { Box, Button, TextField, Typography, IconButton, Switch } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link } from 'react-router-dom';

const Login = ({ darkMode, toggleDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
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
          sx={{ mb: 2, backgroundColor: darkMode ? '#fff' : '#000', color: darkMode ? '#000' : '#fff' }}
        >
          Login
        </Button>
        <Typography>
          Don't have an account? <Link to="/register">Register</Link>
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

export default Login;
