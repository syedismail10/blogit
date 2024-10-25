import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Avatar, CircularProgress } from '@mui/material';
import axios from 'axios';

const EditProfile = () => {
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const authToken = localStorage.getItem('authToken');

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!authToken) return;

      try {
        const response = await axios.get('http://localhost:3000/user/logged-in-user', {
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
      await axios.put('http://localhost:3000/user/edit-profile', formData, {
        headers: {
          Authorization: `${authToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
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
          color="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </form>
    </Box>
  );
};

export default EditProfile;
