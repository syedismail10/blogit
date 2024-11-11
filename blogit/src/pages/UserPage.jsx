// src/pages/UserProfile.jsx

import { useState, useEffect, useContext } from 'react';
import { Box, Typography, CircularProgress, Avatar,Button } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext'; // Import your AuthContext
import { useNavigate } from 'react-router-dom';
import { VITE_API_URL } from '../config';

const UserProfile = () => {
  const authToken = localStorage.getItem('authToken'); // Get authToken from localStorage directly
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data when the component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${VITE_API_URL}/user/logged-in-user`, {
          headers: {
            Authorization: `${authToken}`,
          },
        });
        setUserData(response.data.data); // Assuming the user data is in `data` field
        console.log(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user details.');
      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchUserData();
    } else {
      setError('You must be logged in to view this page.');
      setLoading(false);
    }
  }, [authToken]);

  const handleProfileClick = () => {
    navigate('/edit')
  }

  // Show a loading spinner while fetching data
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Handle error display
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Display user details
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      {userData && (
        <>
          <Avatar
            alt={userData.fullName}
            src={userData.profileImg || ''}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h6">Full Name: {userData.fullName}</Typography>
        </>
      )}
      <Button variant='contained' onClick={handleProfileClick}>Edit</Button>
    </Box>
  );
};

export default UserProfile;
