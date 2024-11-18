import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import NavBar from '../components/Navbar'; // Import the NavBar component
import { useTitle } from '../services/useTitle';
import { useThemeContext } from '../contexts/ThemeContext';

const HomePage = () => {
  const { authToken, logout} = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useThemeContext();

  useTitle("Home | BlogIt");

  return (
    <>
      {/* <NavBar /> Add the NavBar at the top */}
      <Container
        maxWidth="lg"
        sx={{
          mt: '5vh',
          textAlign: 'center',
          backgroundColor: darkMode ? '#121212' : '#fff',
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
            <Button variant="contained" color="primary" onClick={logout} sx={{ mt: '2vh' }}>
              Logout
            </Button>
          </Box>
        ) : (
          <Typography variant="body1">
            Please <Link to="/login" style={{ textDecoration: 'none', color: 'blue' }}>log in</Link> to access your account.
          </Typography>
        )}
      </Container>
    </>
  );
};

export default HomePage;
