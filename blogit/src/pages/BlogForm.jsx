// src/BlogForm.js
import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css'; // import styles
import '@uiw/react-md-editor/markdown.css'; // import styles

const BlogForm = ({ postToEdit, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setBody(postToEdit.body);
    }
  }, [postToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title, body });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{postToEdit ? 'Edit Post' : 'Add New Post'}</h2>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <MDEditor
        value={body}
        onChange={(value) => setBody(value)}
        preview="edit"
      />
      <button type="submit">Save Post</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default BlogForm;
