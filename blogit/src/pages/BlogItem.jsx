// src/BlogItem.js
import React from 'react';
import MDEditor from '@uiw/react-md-editor';

const BlogItem = ({ post, onEdit, onDelete }) => (
  <li>
    <h3>{post.title}</h3>
    <MDEditor.Markdown source={post.body} />
    <button onClick={() => onEdit(post)}>Edit</button>
    <button onClick={() => onDelete(post.id)}>Delete</button>
  </li>
);

export default BlogItem;
