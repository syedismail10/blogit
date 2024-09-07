// src/BlogList.js
import React from 'react';
import BlogItem from './BlogItem';

const BlogList = ({ posts, onEdit, onDelete }) => (
  <div>
    <h2>Posts</h2>
    {posts.length === 0 ? (
      <p>No posts available.</p>
    ) : (
      <ul>
        {posts.map(post => (
          <BlogItem 
            key={post.id} 
            post={post} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </ul>
    )}
  </div>
);

export default BlogList;
