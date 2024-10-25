import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, CircularProgress, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const Comments = ({ blogSlug, blogComments }) => {
  const authToken = localStorage.getItem('authToken');
  const [comments, setComments] = useState(blogComments || []);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggedInUserSlug, setLoggedInUserSlug] = useState(null);

  // Fetch logged-in user's slug
  useEffect(() => {
    const fetchLoggedInUserSlug = async () => {
      if (!authToken) return;

      try {
        const response = await axios.get('http://localhost:3000/user/logged-in-user', {
          headers: {
            Authorization: `${authToken}`,
          },
        });
        setLoggedInUserSlug(response.data.slug);
        console.log(loggedInUserSlug);
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
      }
    };

    fetchLoggedInUserSlug();
  }, []);

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/comments`,
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
      await axios.delete(`http://localhost:3000/comments/${commentId}`, {
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
  );
};

export default Comments;
