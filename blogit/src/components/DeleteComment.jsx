import React, { useState } from 'react';
import { deleteComment } from '../services/api';
import { Button, TextField } from '@mui/material';

const DeleteComment = () => {
  const [commentSlug, setCommentSlug] = useState('');
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    try {
      await deleteComment(commentSlug);
      setMessage('Comment deleted successfully');
    } catch (error) {
      setMessage('Error deleting comment');
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
      <TextField
        type="text"
        value={commentSlug}
        onChange={(e) => setCommentSlug(e.target.value)}
        placeholder="Enter comment slug"
      />
      <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
        <Button variant="contained" color="error" onClick={handleDelete}>Delete Comment</Button>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default DeleteComment;
