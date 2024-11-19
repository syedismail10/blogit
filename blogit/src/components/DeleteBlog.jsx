import React, { useState } from 'react';
import { deleteBlog } from '../services/api';
import { Button, TextField } from '@mui/material';

const DeleteBlog = () => {
  const [blogSlug, setBlogSlug] = useState('');
  const [message, setMessage] = useState('');

  const handleDelete = async () => {
    try {
      await deleteBlog(blogSlug);
      setMessage('Blog deleted successfully');
    } catch (error) {
      setMessage('Error deleting blog');
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
      <TextField
        type="text"
        value={blogSlug}
        onChange={(e) => setBlogSlug(e.target.value)}
        placeholder="Enter blog slug"
      />
      <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
        <Button variant="contained" color="error" onClick={handleDelete}>Delete Blog</Button>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default DeleteBlog;
