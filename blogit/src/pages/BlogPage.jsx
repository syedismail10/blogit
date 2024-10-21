import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, CardMedia, Button } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import MDEditor from '@uiw/react-md-editor';
import Comments from '../components/Comments';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false); // Loading state for voting

  const fetchBlog = async () => {
    setLoading(true);
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`http://localhost:3000/blog/${slug}`, {
        headers: {
          Authorization: `${authToken}`,
        },
      });
      setBlog(response.data.data.blog);
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (type, e) => {
    e.preventDefault();
    setVoting(true);
    const authToken = localStorage.getItem('authToken');
  
    // Optimistically update the vote count
    const newVotes = {
      upvotes: type === 'upvote' ? blog.upvotes + 1 : blog.upvotes,
      downvotes: type === 'downvote' ? blog.downvotes + 1 : blog.downvotes,
    };
    setBlog({ ...blog, ...newVotes });
  
    try {
      await axios.post(`http://localhost:3000/vote/${slug}/${type}`, {}, {
        headers: {
          Authorization: `${authToken}`,
        },
      });
      fetchBlog(); // Refresh blog data to ensure consistency with the server
    } catch (error) {
      console.error(`Error ${type === 'upvote' ? 'upvoting' : 'downvoting'} the blog:`, error);
      // Revert the optimistic update if the request fails
      setBlog({
        ...blog,
        upvotes: type === 'upvote' ? blog.upvotes - 1 : blog.upvotes,
        downvotes: type === 'downvote' ? blog.downvotes - 1 : blog.downvotes,
      });
    } finally {
      setVoting(false);
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

      <MDEditor.Markdown source={blog.description} />

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

      {/* Comments Component */}
      <Comments blogSlug={slug} blogComments={blog.comments} />
    </Box>
  );
};

export default BlogDetail;
