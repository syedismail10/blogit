import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { VITE_API_URL } from '../config';
import { useTitle } from '../services/useTitle';
import { useThemeContext } from '../contexts/ThemeContext';

const BlogItem = ({ post, isEven }) => {
  const { darkMode, toggleDarkMode } = useThemeContext();
  const navigate = useNavigate();

  useTitle("Blog | BlogIt");

  // Handle navigation to blog details page
  const handleCardClick = () => {
    navigate(`/blog/${post.slug}`);
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        height: 268, // Ensure consistent height
        cursor: 'pointer',
        borderRadius: '15px', // Rounded corners
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)', // Hover effect for card
        }
      }}
      onClick={handleCardClick}
    >
      {/* Conditional rendering of image */}
      {post.media && isEven && (
        <CardMedia
          component="img"
          height="140"
          image={post.media}
          alt={post.media}
          sx={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}
        />
      )}

      {/* Add a filled shape when no media */}
      {!post.media && isEven && (
        <Box
          sx={{
            height: 140, // Height of the filled shape
            background: darkMode
                        ? 'linear-gradient(180deg, rgba(19,19,19,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)'
                        : 'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(45,94,253,1) 100%)',
            borderBottomLeftRadius: isEven ? 0 : '15px',
            borderBottomRightRadius: isEven ? 0 : '15px',
            borderTopLeftRadius: isEven ? '15px' : 0,
            borderTopRightRadius: isEven ? '15px' : 0,
          }}
        />
      )}

      <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 'bold', color: 'primary' }}>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {post.description}
        </Typography>
        <Typography sx={{ mt: 2 }} variant="subtitle2" color="text.secondary">
          By: {post.user.fullName}
        </Typography>
      </CardContent>

      {/* Add a filled shape when no media */}
      {!post.media && !isEven && (
        <Box
          sx={{
            height: 140, // Height of the filled shape
            background: darkMode
                        ? 'linear-gradient(180deg, rgba(19,19,19,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)'
                        : 'linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(45,94,253,1) 100%)',
            borderBottomLeftRadius: isEven ? 0 : '15px',
            borderBottomRightRadius: isEven ? 0 : '15px',
            borderTopLeftRadius: isEven ? '15px' : 0,
            borderTopRightRadius: isEven ? '15px' : 0,
          }}
        />
      )}

      {/* Image at the bottom for odd posts */}
      {post.media && !isEven && (
        <CardMedia
          component="img"
          height="140"
          image={post.media}
          alt={post.media}
          sx={{ borderBottomLeftRadius: '15px', borderBottomRightRadius: '15px' }}
        />
      )}
    </Card>
  );
};

export default BlogItem;
