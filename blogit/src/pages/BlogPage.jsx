import React, { useContext, useEffect, useState } from 'react';
import { Box, Typography, Avatar, Card, CardContent, CardMedia, CircularProgress, Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor'; // Importing the Markdown editor for rendering
import { AuthContext } from '../contexts/AuthContext';
import ThemeContext from '../contexts/ThemeContext';

const BlogDetail = () => {
  const { slug } = useParams(); // Getting the blog slug from the route
  const { authToken } = useContext(AuthContext); // Accessing authToken from AuthContext
  const { darkMode } = useContext(ThemeContext); // Accessing darkMode from ThemeContext

  const [blog, setBlog] = useState(null); // Blog data
  const [loading, setLoading] = useState(true); // Loading state

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/blog/${slug}`, {
        headers: {
          Authorization: `${authToken}`,
        },
      });
      setBlog(response.data.data); // Set the blog data from the API response
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ py: 5 }}>
      {blog && (
        <Card sx={{ boxShadow: 3, backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#000' }}>
          {/* Blog Cover Image */}
          {blog.media && (
            <CardMedia
              component="img"
              height="300"
              image={blog.media}
              alt={blog.title}
              sx={{ borderBottom: '1px solid #ddd', objectFit: 'cover' }}
            />
          )}

          {/* Blog Content */}
          <CardContent>
            {/* Blog Title */}
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              {blog.title}
            </Typography>

            {/* Blog Author Info */}
            <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
              <Avatar src={blog.user.profileImg || '/default-avatar.png'} alt={blog.user.fullName} />
              <Box ml={2}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {blog.user.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(blog.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            {/* Blog Body (Rendered as Markdown) */}
            <Box sx={{ mt: 3, backgroundColor: darkMode ? '#282c34' : '#f9f9f9', p: 3, borderRadius: 2 }}>
              <MDEditor.Markdown source={blog.description} style={{ whiteSpace: 'pre-wrap' }} />
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default BlogDetail;
