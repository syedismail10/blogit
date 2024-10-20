import React, { useState } from 'react';
import { blockUser, unblockUser } from '../services/api';

const BlockUser = () => {
  const [userSlug, setUserSlug] = useState('');
  const [message, setMessage] = useState('');

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
    <div>
      <h2>Block/Unblock User</h2>
      <input
        type="text"
        value={userSlug}
        onChange={(e) => setUserSlug(e.target.value)}
        placeholder="Enter user slug"
      />
      <button onClick={handleBlock}>Block User</button>
      <button onClick={handleUnblock}>Unblock User</button>
      <p>{message}</p>
    </div>
  );
};

export default BlockUser;
