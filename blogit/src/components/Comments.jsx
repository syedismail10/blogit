import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext'; // Import your AuthContext

const Comments = ({ blogSlug }) => {
  const { authToken } = useContext(AuthContext); // Get authToken from AuthContext
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);

  // Fetch comments for the blog post
  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await axios.get(`http://localhost:3000/comments/${blogSlug}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [blogSlug]);

  // Handle adding a new comment
  // Handle adding a new comment
const handleAddComment = async () => {
    if (!newComment.trim()) return; // Prevent empty comments
  
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3000/comments`,  // Adjusted to the correct route
        {
          comment: newComment, // Sending the comment text
          blog_slug: blogSlug,  // Sending the blog slug in request body
        },
        {
          headers: {
            Authorization: `${authToken}`,  // Still sending authToken in headers
          },
        }
      );
      // Add the new comment to the existing list
      setComments((prevComments) => [...prevComments, response.data.comment]);
      setNewComment(''); // Clear the input field after adding
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Comments
      </Typography>

      {/* Displaying comments */}
      {loadingComments ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      ) : comments.length === 0 ? (
        <Typography>No comments yet. Be the first to comment!</Typography>
      ) : (
    <List>
        {comments.map((comment, index) => (
            <ListItem key={index}>
                <ListItemText
                    primary={comment?.user?.fullName || 'Anonymous'}  // Safe access to user.fullName
                    secondary={comment?.text || 'Empty'}
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
