import React, { useState } from 'react';
import { deleteBlog } from '../services/api';

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
    <div>
      <h2>Delete Blog</h2>
      <input
        type="text"
        value={blogSlug}
        onChange={(e) => setBlogSlug(e.target.value)}
        placeholder="Enter blog slug"
      />
      <button onClick={handleDelete}>Delete Blog</button>
      <p>{message}</p>
    </div>
  );
};

export default DeleteBlog;
