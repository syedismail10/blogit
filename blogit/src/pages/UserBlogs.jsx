import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent, CardMedia, Button, Avatar, Pagination } from '@mui/material';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const UserBlogs = () => {
  const { user_slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [user, setUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [isFollowing, setFollowing] = useState(false);
  const [isSelf, setIsSelf] = useState(false); // New state to check if the user is viewing their own profile

  const authToken = localStorage.getItem('authToken');
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Fetch user details
  const fetchUserDetails = async () => {
    setUserLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/user/info/${user_slug}`, {
        headers: {
          Authorization: `${authToken}`,
        },
      });
      const userData = response.data.data;
      setUser(userData);
      setFollowing(userData.followStatus === 'following');
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setUserLoading(false);
    }
  };

  // Fetch logged-in user details to check if they are viewing their own profile
  const fetchLoggedInUser = async () => {
    try {
      const response = await axios.get('http://localhost:3000/user/logged-in-user', {
        headers: {
          Authorization: `${authToken}`,
        },
      });
      const loggedInUserData = response.data.data;
      setLoggedInUser(loggedInUserData);

      // Check if the user is viewing their own profile
      if (loggedInUserData && user) {
        setIsSelf(loggedInUserData.fullName === user.fullName);
      }
    } catch (error) {
      console.error('Error fetching logged-in user:', error);
    }
  };

  // Fetch blogs by the user with pagination
  const fetchUserBlogs = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/blog/user/${user_slug}`, {
        params: { page },
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

  // Fetch logged-in user only after user details are available
  useEffect(() => {
    if (user) {
      fetchLoggedInUser();
    }
  }, [user]);

  const handlePageChange = (event, value) => {
    setSearchParams({ page: value });
  };

  const handleFollowToggle = async () => {
    try {
      const endpoint = isFollowing
        ? `http://localhost:3000/relationships/unfollow/${user_slug}`
        : `http://localhost:3000/relationships/follow/${user_slug}`;
      
      await axios.post(endpoint, {}, {
        headers: {
          Authorization: `${authToken}`,
        },
      });
      setFollowing(!isFollowing);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  if (userLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* User Information */}
      {user && (
        <Box display="flex" alignItems="center" sx={{ mb: 4 }}>
          <Avatar
            src={user.profileImg}
            alt={user.fullName}
            sx={{ width: 56, height: 56, mr: 2 }}
          />
          <Box>
            <Typography variant="h5">{user.fullName}</Typography>
            <Typography variant="body2" color="text.secondary">
              Followers: {user.followers} | Following: {user.following}
            </Typography>
          </Box>

          {/* Follow/Unfollow Button */}
          {!isSelf && (
            <Button
              variant={isFollowing ? 'contained' : 'outlined'}
              onClick={handleFollowToggle}
              sx={{ ml: 3 }}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </Box>
      )}

      {/* User Blogs */}
      <Typography variant="h4" gutterBottom>
        Blogs by {user?.fullName || user_slug}
      </Typography>

      {blogs.length === 0 ? (
        <Typography variant="h6">No blogs found for this user.</Typography>
      ) : (
        blogs.map((blog) => (
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
        ))
      )}

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
