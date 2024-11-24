import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  CardMedia,
  Button,
  Link as MuiLink,
} from '@mui/material';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import Comments from '../components/Comments';
import { VITE_API_URL } from '../config';
import { useTitle } from '../services/useTitle';
import { useThemeContext } from '../contexts/ThemeContext';

const BlogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useThemeContext();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [loggedInUserSlug, setLoggedInUserSlug] = useState(null);
  const [votingStatus,setVotingStatus] = useState('');

  useTitle('BlogIt');

  // Fetch blog details
  const fetchBlog = useCallback(async () => {
    setLoading(true);
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${VITE_API_URL}/blog/${slug}`, {
        headers: { Authorization: `${authToken}` },
      });
      setBlog(response.data.data.blog);
      setVotingStatus(response.data.data.votingStatus);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  // Fetch logged-in user details
  const fetchLoggedInUserSlug = useCallback(async () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) return;
    try {
      const response = await axios.get(`${VITE_API_URL}/user/logged-in-user`, {
        headers: { Authorization: `${authToken}` },
      });
      setLoggedInUserSlug(response.data.data.slug);
    } catch (error) {
      console.error('Error fetching logged-in user:', error);
    }
  }, []);

  // Handle voting
  const handleVote = async (type) => {
    const typecheck = type + 'd';
    if (votingStatus === typecheck) {
      console.log(`Already ${type}d. No request made.`);
      alert(`${type} already done`)
      return;
    }

    setVoting(true);
    const authToken = localStorage.getItem('authToken');
    try {
      await axios.post(
        `${VITE_API_URL}/vote/${slug}/${type}`,
        {},
        {
          headers: { Authorization: `${authToken}` },
        }
      );

      // Optimistically update voting status
      setBlog((prevBlog) => ({
        ...prevBlog,
        votingStatus: type,
        upvotes: type === 'upvote' ? prevBlog.upvotes + 1 : prevBlog.upvotes,
        downvotes: type === 'downvote' ? prevBlog.downvotes + 1 : prevBlog.downvotes,
      }));

      // Refresh the blog data
      await fetchBlog();
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVoting(false);
    }
  };

  // Handle blog deletion
  const handleDeleteBlog = async () => {
    const authToken = localStorage.getItem('authToken');
    try {
      await axios.delete(`${VITE_API_URL}/blog/delete/${slug}`, {
        headers: { Authorization: `${authToken}` },
      });
      navigate(`/user/${blog.user_slug}`); // Redirect to user profile
    } catch (error) {
      console.error('Error deleting the blog:', error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchBlog();
    fetchLoggedInUserSlug();
  }, [fetchBlog, fetchLoggedInUserSlug]);

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
      {/* Blog Title */}
      <Typography variant="h3" gutterBottom>
        {blog.title}
      </Typography>

      {/* Blog Media */}
      {blog.media && (
        <CardMedia
          component="img"
          height="400"
          image={blog.media}
          alt={blog.title}
          sx={{ marginBottom: 3 }}
        />
      )}

      {/* Blog Author and Date */}
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        By{' '}
        <MuiLink
          component={Link}
          to={`/user/${blog.user_slug}`}
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            borderBottom: '1px solid transparent',
            '&:hover': { borderBottom: '1px solid' },
          }}
        >
          {blog.user.fullName}
        </MuiLink>{' '}
        | {new Date(blog.createdAt).toLocaleDateString()}
      </Typography>

      {/* Blog Content */}
      <MDEditor.Markdown source={blog.description} />

      {/* Voting Buttons */}
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

      {/* Delete Button for Blog Owner */}
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

      {/* Comments Section */}
      <Comments blogSlug={slug} blogComments={blog.comments} />
    </Box>
  );
};

export default BlogDetail;
