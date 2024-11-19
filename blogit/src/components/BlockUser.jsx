import React, { useState } from 'react';
import { blockUser, unblockUser } from '../services/api';
import { Button, TextField } from '@mui/material';
import { useThemeContext } from '../contexts/ThemeContext';

const BlockUser = () => {
  const [userSlug, setUserSlug] = useState('');
  const [message, setMessage] = useState('');
  const { darkMode, toggleDarkMode } = useThemeContext();

  const handleBlock = async () => {
    try {
      await blockUser(userSlug);
      setMessage('User blocked successfully');
    } catch (error) {
      setMessage('Error blocking user');
    }
  };

  const handleUnblock = async () => {
    try {
      await unblockUser(userSlug);
      setMessage('User unblocked successfully');
    } catch (error) {
      setMessage('Error unblocking user');
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
      <TextField
        type="text"
        value={userSlug}
        onChange={(e) => setUserSlug(e.target.value)}
        placeholder="Enter user slug"
      />
      <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
        <Button variant="contained" color="error" onClick={handleBlock}>Block User</Button>
        <Button variant={darkMode ? "contained" : "outlined"} color={darkMode ? "warning" : "error"} onClick={handleUnblock}>Unblock User</Button>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default BlockUser;
