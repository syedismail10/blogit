import React, { useState } from 'react';
import { promoteUser } from '../services/api';

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
    <div>
      <h2>Promote User to Admin</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter user email"
      />
      <button onClick={handlePromote}>Promote to Admin</button>
      <p>{message}</p>
    </div>
  );
};

export default PromoteUser;
