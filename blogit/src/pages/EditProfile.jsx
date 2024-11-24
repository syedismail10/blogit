import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Avatar, CircularProgress } from '@mui/material';
import axios from 'axios';
import { VITE_API_URL } from '../config';
import { useTitle } from '../services/useTitle';
import { ToastContainer, toast } from 'react-toastify';
import { useThemeContext } from '../contexts/ThemeContext';
import NotLoggedIn from './NotLoggedIn';

const EditProfile = () => {
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { darkMode, toggleDarkMode } = useThemeContext();

  useTitle("Edit Profile | BlogIt");

  const authToken = localStorage.getItem('authToken');

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
        const { fullName, profileImg } = response.data.data;
        setName(fullName);
        setProfileImagePreview(profileImg);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [authToken]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('fullName', name);
    if (profileImage) {
      formData.append('profileImg', profileImage);
    }

    try {
      await axios.put(`${VITE_API_URL}/user/edit-profile`, formData, {
        headers: {
          Authorization: `${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.info('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!authToken) {
    return <NotLoggedIn/>;
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        transition: Bounce
      />
      <Box sx={{ maxWidth: 400, mx: 'auto', p: 3, mt: 4 }}>
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            marginBottom: '30px', 
            fontWeight: 800, 
            fontFamily: '"Besley", serif' 
          }}
        >
          Edit Profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              src={profileImagePreview}
              alt="Profile Preview"
              sx={{ width: 80, height: 80, mr: 2 }}
            />
            <Button variant="contained" component="label">
              Change Profile Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Save Changes'}
          </Button>
        </form>
      </Box>
    </>
  );
};

export default EditProfile;
