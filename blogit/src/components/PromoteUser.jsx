import React, { useState } from 'react';
import { promoteUser } from '../services/api';
import { Button, TextField } from '@mui/material';

const PromoteUser = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePromote = async () => {
    try {
      await promoteUser(email);
      setMessage('User promoted to admin successfully');
    } catch (error) {
      setMessage('Error promoting user' + error.message);
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
      <TextField
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter user email"
      />
      <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
        <Button variant="contained" color="warning" onClick={handlePromote}>Promote to Admin</Button>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default PromoteUser;
