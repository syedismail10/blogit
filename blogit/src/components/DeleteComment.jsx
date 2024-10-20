import React, { useState } from 'react';
import { deleteComment } from '../services/api';

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
    <div>
      <h2>Delete Comment</h2>
      <input
        type="text"
        value={commentSlug}
        onChange={(e) => setCommentSlug(e.target.value)}
        placeholder="Enter comment slug"
      />
      <button onClick={handleDelete}>Delete Comment</button>
      <p>{message}</p>
    </div>
  );
};

export default DeleteComment;
