import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, CircularProgress, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
import { VITE_API_URL } from '../config';
import LoadingModal from './LoadingModal';

const Comments = ({ blogSlug, blogComments }) => {
  const authToken = localStorage.getItem('authToken');
  const [comments, setComments] = useState(blogComments || []);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [loggedInUserSlug, setLoggedInUserSlug] = useState(null);
  const [roastLoading, setRoastLoading] = useState(false);

  // Fetch logged-in user's slug
  useEffect(() => {
    const fetchLoggedInUserSlug = async () => {
      setLoading(true);
      if (!authToken) return;

      try {
        const response = await axios.get(`${VITE_API_URL}/user/logged-in-user`, {
          headers: {
            Authorization: `${authToken}`,
          },
        });
        setLoggedInUserSlug(response.data.slug);
        console.log(loggedInUserSlug);
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
      }
      setLoading(false);
    };

    fetchLoggedInUserSlug();
  }, []);

  const fetchBlogRoast = async () => {
    setRoastLoading(true); // Set loading to true while the request is in progress
    try {
      const response = await axios.get(`${VITE_API_URL}/blog/roast/${blogSlug}`, {
        headers: {
          Authorization: `${authToken}`,
        },
      });
      setNewComment(response.data.data.roast.content);
    } catch (error) {
      console.error('Error fetching blog roast:', error);
      setRoastLoading(false);
    } finally {
      setRoastLoading(false);
    }
  };

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${VITE_API_URL}/comments`,
        {
          comment: newComment,
          blog_slug: blogSlug,
        },
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      );

      const { comment, fullName } = response.data.data;
      const newCommentObject = {
        comment: comment.comment,
        createdAt: comment.createdAt,
        user: {
          fullName: fullName,
          slug: loggedInUserSlug, // Add the logged-in user's slug to the new comment object
        },
      };

      setComments((prevComments) => [newCommentObject, ...prevComments]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId) => {
    setLoading(true);
    try {
      await axios.delete(`${VITE_API_URL}/comments/${commentId}`, {
        headers: {
          Authorization: `${authToken}`,
        },
      });

      // Remove the comment from the list after successful deletion
      setComments((prevComments) => prevComments.filter((c) => c.slug !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sort comments by createdAt in ascending order (oldest at the top)
  const sortedComments = comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <>
      <LoadingModal isOpen={loading || roastLoading} message={roastLoading ? 'Our AI is working hard to roast this blog...' : 'Loading'}/>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Comments
        </Typography>

        {/* Displaying comments */}
        {comments.length === 0 ? (
          <Typography>No comments yet. Be the first to comment!</Typography>
        ) : (
          <List>
            {sortedComments.map((comment) => (
              <ListItem key={comment.slug} secondaryAction={
                comment?.userslug === loggedInUserSlug && (
                  <IconButton edge="end" onClick={() => handleDeleteComment(comment.slug)}>
                    <DeleteIcon />
                  </IconButton>
                )
              }>
                <ListItemText
                  key={comment.slug}
                  primary={comment?.user?.fullName || 'Anonymous'}
                  secondary={comment?.comment || 'Empty'}
                />
              </ListItem>
            ))}
          </List>
        )}

        {/* Adding a new comment */}
        {authToken ? (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              label="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              variant="contained"
              color="secondary"
              onClick={fetchBlogRoast}
              sx={{ mt: 2, mr: 5 }}
              disabled={roastLoading}
            >
              Roast!
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddComment}
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Comment'}
            </Button>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            You must be logged in to add a comment.
          </Typography>
        )}
      </Box>
    </>
  );
};

export default Comments;
