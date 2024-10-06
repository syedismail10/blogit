import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia, CircularProgress } from '@mui/material';
import BlogItem from './BlogItem';
import axios from 'axios';

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async (pageNum) => {
    setLoading(true); // Show loading spinner
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await axios.get(`http://localhost:3000/blog?page=${pageNum}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setPosts(response.data.data); // Use response.data.data to access blog list
      setTotalPages(response.data.totalPages); // Assuming API provides total pages
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages) {
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
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
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
              <Card sx={{ maxWidth: 345, boxShadow: 3 }}>
                {post.media && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={post.media}
                    alt={post.title}
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
                </CardContent>
              </Card>
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
          disabled={page === totalPages}
          sx={{ px: 3 }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default BlogList;
