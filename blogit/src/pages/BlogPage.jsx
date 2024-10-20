import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, CardMedia } from '@mui/material';
import { Link, useParams } from 'react-router-dom'; // Import Link from react-router-dom
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import Comments from '../components/Comments';

const BlogDetail = () => {
  const { slug } = useParams(); // Get the blog slug from the URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    setLoading(true);
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`http://localhost:3000/blog/${slug}`, {
        headers: {
          Authorization: `${authToken}`,
        },
      });
      setBlog(response.data.data.blog); // Set the fetched blog data
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
        By{' '}
        <Link to={`/user/${blog.user_slug}`} style={{ textDecoration: 'none', color: 'inherit' }}
        onMouseEnter={(e) => e.target.style.borderBottom = '1px solid'}
        onMouseLeave={(e) => e.target.style.borderBottom = '1px solid transparent'}>
          {blog.user.fullName}
        </Link>{' '}
        | {new Date(blog.createdAt).toLocaleDateString()}
      </Typography>

      <MDEditor.Markdown source={blog.description} />

      {/* Comments Component */}
      <Comments blogSlug={slug} blogComments={blog.comments} />
    </Box>
  );
};

export default BlogDetail;
