import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, CardMedia, Button } from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import Comments from '../components/Comments';
import { VITE_API_URL } from '../config';
import { useTitle } from '../services/useTitle';
import { useThemeContext } from '../contexts/ThemeContext';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate(); // Use useNavigate for navigation
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [loggedInUserSlug, setLoggedInUserSlug] = useState(null);
  const { darkMode, toggleDarkMode } = useThemeContext();

  useTitle("BlogIt");

  const fetchBlog = async () => {
    setLoading(true);
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${VITE_API_URL}/blog/${slug}`, {
        headers: {
          Authorization: `${authToken}`,
        },
      });
      setBlog(response.data.data.blog);
      console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLoggedInUserSlug = async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return;

    try {
      const response = await axios.get(`${VITE_API_URL}/user/logged-in-user`, {
        headers: {
          Authorization: `${authToken}`,
        },
      });
      setLoggedInUserSlug(response.data.data.slug);
    } catch (error) {
      console.error('Error fetching logged-in user:', error);
    }
  };

  const handleVote = async (type) => {
    setVoting(true);
    const authToken = localStorage.getItem('authToken');

    // Better error handling and logging
    try {
        // Log the request details
        console.log('Making request to:', `${VITE_API_URL}/vote/${slug}/${type}`);
        console.log('Headers:', {
            Authorization: `${authToken}`,
        });

        const response = await axios.post(
            `${VITE_API_URL}/vote/${slug}/${type}`,
            {}, // empty body
            {
                headers: {
                    'Authorization': `${authToken}`, // Add 'Bearer' if required
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Vote response:', response.data);
        await fetchBlog(); // Make sure this is awaited

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
        } else {
            console.error('Error voting:', error);
        }

        // Revert the optimistic update
        setBlog(prevBlog => ({
            ...prevBlog,
            upvotes: type === 'upvote' ? prevBlog.upvotes - 1 : prevBlog.upvotes,
            downvotes: type === 'downvote' ? prevBlog.downvotes - 1 : prevBlog.downvotes,
        }));
    } finally {
        setVoting(false);
    }
  };

  const handleDeleteBlog = async () => {
    const authToken = localStorage.getItem('authToken');
    try {
      await axios.delete(`${VITE_API_URL}/blog/delete/${slug}`, {
        headers: {
          Authorization: `${authToken}`,
        },
      });
      // Redirect to the home page or another appropriate page after deletion
      navigate(`/user/${blog.user_slug}`);
    } catch (error) {
      console.error('Error deleting the blog:', error);
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchLoggedInUserSlug();
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
    <Box sx={{ p: 3 }} data-color-mode={darkMode ? 'dark' : 'light'}>
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
        <Link
          to={`/user/${blog.user_slug}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
          onMouseEnter={(e) => e.target.style.borderBottom = '1px solid'}
          onMouseLeave={(e) => e.target.style.borderBottom = '1px solid transparent'}
        >
          {blog.user.fullName}
        </Link>{' '}
        | {new Date(blog.createdAt).toLocaleDateString()}
      </Typography>

      <MDEditor.Markdown source={blog.description}/>

      {/* Upvote/Downvote Buttons */}
      <Box display="flex" gap={2} sx={{ my: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleVote('upvote')}
          disabled={voting}
        >
          Upvote {blog.upvotes}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleVote('downvote')}
          disabled={voting}
        >
          Downvote {blog.downvotes}
        </Button>
      </Box>

      {/* Delete Blog Button */}
      {loggedInUserSlug === blog.user.slug && (
        <Button
          variant="outlined"
          color="error"
          onClick={handleDeleteBlog}
          sx={{ my: 2 }}
        >
          Delete Blog
        </Button>
      )}

      {/* Comments Component */}
      <Comments blogSlug={slug} blogComments={blog.comments} />
    </Box>
  );
};

export default BlogDetail;
