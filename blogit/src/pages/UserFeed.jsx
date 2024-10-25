import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent, CardMedia } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserFeed = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFollowingBlogs = async () => {
    const authToken = localStorage.getItem('authToken');
    setLoading(true);

    try {
      const response = await axios.get('http://localhost:3000/blog/following', {
        headers: {
          Authorization: `${authToken}`,
        },
      });
      setBlogs(response.data.data); // Adjust based on your API response structure
    } catch (error) {
      console.error('Error fetching following blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowingBlogs();
  }, []);

  const handleCardClick = (slug) => {
    navigate(`/blog/${slug}`); // Navigate to blog details page with blog slug
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Feed
      </Typography>

      {blogs.length === 0 ? (
        <Typography>No blogs found from your following. Start following creators to see their blogs here!</Typography>
      ) : (
        blogs.map((blog) => (
          <Card 
            key={blog.slug} 
            sx={{ mb: 2, cursor: 'pointer' }} 
            onClick={() => handleCardClick(blog.slug)} // Pass blog.slug to the handler
          >
            {blog.media && (
              <CardMedia
                component="img"
                height="200"
                image={blog.media}
                alt={blog.title}
              />
            )}
            <CardContent>
              <Typography variant="h5" component="div">
                {blog.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                By{' '}
                <Link to={`/user/${blog.user_slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {blog.user.fullName}
                </Link>
                {' | '}
                {new Date(blog.createdAt).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {blog.description.slice(0, 100)}...
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default UserFeed;
