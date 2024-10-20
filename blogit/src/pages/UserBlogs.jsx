import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent, CardMedia, Button, Avatar, Pagination } from '@mui/material';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const UserBlogs = () => {
  const { user_slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const authToken = localStorage.getItem('authToken');

  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = 5;

  // Fetch user details
  const fetchUserDetails = async () => {
    setUserLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/user/info/${user_slug}`, {
        headers: {
          Authorization: `${authToken}`,
        },
      });
      setUser(response.data.data); // Adjust based on the API response structure
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setUserLoading(false);
    }
  };

  // Fetch blogs by the user with pagination
  const fetchUserBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/blog/user/${user_slug}`, {
        params: { page},
        headers: {
          Authorization: `${authToken}`,
        },
      });
      setBlogs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching user blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchUserBlogs();
  }, [user_slug, page]);

  const handlePageChange = (event, value) => {
    setSearchParams({ page: value });
  };

  if (userLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!blogs.length) {
    return <Typography variant="h6">No blogs found for this user.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* User Information */}
      {user && (
        <Box display="flex" alignItems="center" sx={{ mb: 4 }}>
          <Avatar
            src={user.profileImg} // Adjust this based on the user's profile image field
            alt={user.fullName}
            sx={{ width: 56, height: 56, mr: 2 }}
          />
          <Box>
            <Typography variant="h5">{user.fullName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>
      )}

      {/* User Blogs */}
      <Typography variant="h4" gutterBottom>
        Blogs by {user?.fullName || user_slug}
      </Typography>

      {blogs.map((blog) => (
        <Card key={blog.slug} sx={{ mb: 2 }}>
          {blog.media && (
            <CardMedia
              component="img"
              height="200"
              image={blog.media}
              alt={blog.title}
            />
          )}
          <CardContent>
            <Typography variant="h5">{blog.title}</Typography>
            <Typography variant="body1" paragraph>
              {blog.description.substring(0, 150)}...
            </Typography>
            <Button 
              component={Link} 
              to={`/blog/${blog.slug}`} 
              variant="outlined"
            >
              Read More
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Pagination Controls */}
      <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
        <Pagination 
          page={page} 
          onChange={handlePageChange} 
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default UserBlogs;
