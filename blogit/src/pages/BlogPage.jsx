import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, CircularProgress, CardMedia } from '@mui/material';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import { useParams } from 'react-router-dom';
import Comments from '../components/Comments'; // Import Comments component
import { AuthContext } from '../contexts/AuthContext'; // Import AuthContext for authentication

const BlogDetail = () => {
  const { slug } = useParams(); // Get the blog slug from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authToken } = useContext(AuthContext); // Access authToken for potential API calls

  // Fetch blog details by slug
  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/blog/${slug}`, {
        headers: {
          Authorization: `${authToken}`,
        },
      });
      setBlog(response.data.data); // Set the fetched blog data
      console.log(blog);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!blog) {
    return <Typography variant="h6">Blog not found.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" gutterBottom>
        {blog.title}
      </Typography>

      {blog.media && (
        <CardMedia
          component="img"
          height="400"
          image={blog.media}
          alt={blog.title}
          sx={{ marginBottom: 3 }}
        />
      )}

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        By {blog.user.fullName} | {new Date(blog.createdAt).toLocaleDateString()}
      </Typography>

      {/* Render Markdown content using MDEditor for the blog body */}
      <MDEditor.Markdown source={blog.description} />

      {/* Comments Component */}
      <Comments blogSlug={slug} /> {/* Pass the slug of the blog to Comments */}
    </Box>
  );
};

export default BlogDetail;
