import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Box } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { VITE_API_URL } from '../config';
import { useTitle } from '../services/useTitle';

const BlogItem = ({ post }) => {
  const [upvotes, setUpvotes] = useState(post.upvotes); // Track upvotes
  const [downvotes, setDownvotes] = useState(post.downvotes); // Track downvotes
  const [hasVoted, setHasVoted] = useState(null); // Track if user has voted (null, 'upvote', 'downvote')
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  useTitle("Blog | BlogIt");

  // Function to handle upvote/downvote
  // const handleVote = async (voteType) => {
  //   const authToken = localStorage.getItem('authToken');
  //   try {
  //     const response = await axios.post(`VITE_API_URL/vote/${post.slug}/${voteType}`, {}, {
  //       headers: {
  //         Authorization: `${authToken}`,
  //       },
  //     });

  //     if (response.status === 200) {
  //       // Update the local vote count immediately after a successful vote
  //       if (voteType === 'upvote') {
  //         setUpvotes(upvotes + 1); // Increment upvotes
  //         if (hasVoted === 'downvote') setDownvotes(downvotes - 1); // Adjust downvotes if switching vote
  //       } else if (voteType === 'downvote') {
  //         setDownvotes(downvotes + 1); // Increment downvotes
  //         if (hasVoted === 'upvote') setUpvotes(upvotes - 1); // Adjust upvotes if switching vote
  //       }
  //       setHasVoted(voteType); // Set the current vote type
  //     }
  //   } catch (error) {
  //     console.error('Error voting:', error);
  //   }
  // };

  // Handle navigation to blog details page
  const handleCardClick = () => {
    navigate(`/blog/${post.slug}`); // Navigate to blog details page with blog slug
  };

  return (
    <Card 
      sx={{ maxWidth: 345, boxShadow: 3, cursor: 'pointer' }} 
      onClick={handleCardClick} // Add onClick handler for the card
    >
      {post.media && (
        <CardMedia
          component="img"
          height="140"
          image={post.media}
          alt={post.media}
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {post.description}
        </Typography>
        <Typography sx={{ mt: 2 }} variant="subtitle2" color="text.secondary">
          By {post.user.fullName}
        </Typography>

        {/* Voting Icons */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box display="flex" alignItems="center" onClick={(e) => e.stopPropagation()}> {/* Prevent card click on vote */}
            <IconButton
              color={hasVoted === 'upvote' ? 'primary' : 'default'} // Highlight if voted
              
            >
              <ThumbUpIcon />
            </IconButton>
            <Typography variant="body2" sx={{ ml: 1 }}>{upvotes}</Typography>
          </Box>
          <Box display="flex" alignItems="center" onClick={(e) => e.stopPropagation()}> {/* Prevent card click on vote */}
            <IconButton
              color={hasVoted === 'downvote' ? 'secondary' : 'default'} // Highlight if voted
              
            >
              <ThumbDownIcon />
            </IconButton>
            <Typography variant="body2" sx={{ ml: 1 }}>{downvotes}</Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BlogItem;
