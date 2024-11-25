import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Button, Grid, CircularProgress, Grid2 } from '@mui/material';
import axios from 'axios';
import BlogItem from './BlogItem';  // Import BlogItem component
import { VITE_API_URL } from '../config';
import { useTitle } from '../services/useTitle';
import NotLoggedIn from './NotLoggedIn';
import { AuthContext } from '../contexts/AuthContext';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);  // To check if it's the last page
  const [loading, setLoading] = useState(false);
  const postsPerPage = 5;  // Set the maximum number of posts per page
  const { authToken } = useContext(AuthContext);

  useTitle("Browse Blogs | BlogIt");
  
  const fetchBlogs = async (pageNum) => {
    setLoading(true);  // Show loading spinner
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.get(`${VITE_API_URL}/blog?page=${pageNum}`, {
        headers: {
          Authorization: `${authToken}`,
        },
      });
  
      const fetchedPosts = response.data.data;  // Get posts from the response
      setPosts(fetchedPosts);
  
      // If the number of posts fetched is less than postsPerPage, assume it's the last page
      if (fetchedPosts.length < postsPerPage) {
        setIsLastPage(true);
      } else {
        setIsLastPage(false);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);  // Hide loading spinner
    }
  };
    

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const handleNextPage = () => {
    if (!isLastPage) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  if (!authToken) {
    return <NotLoggedIn/>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography 
        variant="h3" 
        gutterBottom 
        sx={{ 
          marginBottom: '50px', 
          fontWeight: 800, 
          fontFamily: '"Besley", serif',
          textAlign: 'center'
        }}
      >
        Blogs
      </Typography>


      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '50vh' }}>
          <CircularProgress color="secondary" size={60} />
        </Box>
      ) : posts.length === 0 ? (
        <Typography align="center" variant="h6" sx={{ color: 'gray', fontStyle: 'italic' }}>
          No posts available.
        </Typography>
      ) : (
        <Grid2 
          container 
          spacing={3} 
          justifyContent="center" 
          alignItems="center"
        >
          {posts.map((post, index) => (
            <Grid2 item xs={12} sm={6} md={4}key={post.slug}>
              <BlogItem
                post={post}
                isEven={index % 2 === 0} // Pass 'isEven' based on the index
                sx={{ borderRadius: '10px', boxShadow: 3 }}
              />
            </Grid2>
          ))}
        </Grid2>
      )}

      <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrevPage}
          disabled={page === 1}
          sx={{ mr: 2, px: 3 }}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleNextPage}
          disabled={isLastPage}
          sx={{ px: 3 }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default BlogList;
