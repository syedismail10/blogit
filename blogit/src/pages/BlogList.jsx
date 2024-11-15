import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';
import BlogItem from './BlogItem';  // Import BlogItem component
import { VITE_API_URL } from '../config';
import { useTitle } from '../services/useTitle';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);  // To check if it's the last page
  const [loading, setLoading] = useState(false);
  const postsPerPage = 5;  // Set the maximum number of posts per page

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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold',}}>
        Blog Posts
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Typography align="center" variant="h6">
          No posts available.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {posts.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.slug}>
              <BlogItem post={post} />  {/* Pass post data to BlogItem component */}
            </Grid>
          ))}
        </Grid>
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
