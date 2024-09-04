import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Navbar from '../components/Navbar';

const HomePage = ({ toggleDarkMode }) => {
  return (
    <>
      {/* <Navbar toggleDarkMode={toggleDarkMode} /> */}
      <Container maxWidth="lg" sx={{ mt: '5vh', textAlign: 'center' }}>
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
        <Typography variant="body1">
          This is your homepage. Add your blog posts, news updates, or any other content you wish to display here.
        </Typography>
      </Container>
    </>
  );
};

export default HomePage;
