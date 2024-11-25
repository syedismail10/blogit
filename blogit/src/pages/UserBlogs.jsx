import React, { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Card, CardContent, CardMedia, Button, Avatar, Pagination, Grid2 } from '@mui/material';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { VITE_API_URL } from '../config';
import { useTitle } from '../services/useTitle';
import BlogItem from './BlogItem';
import NotLoggedIn from './NotLoggedIn';
import LoadingModal from '../components/LoadingModal';

const UserBlogs = () => {
  useTitle("User Blogs | BlogIt");

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
      const response = await axios.get(`${VITE_API_URL}/user/info/${user_slug}`, {
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
      const response = await axios.get(`${VITE_API_URL}/user/logged-in-user`, {
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
      const response = await axios.get(`${VITE_API_URL}/blog/user/${user_slug}`, {
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
    const authToken = localStorage.getItem('authToken');
    try {
      const endpoint = isFollowing
        ? `${VITE_API_URL}/relationships/unfollow/${user_slug}`
        : `${VITE_API_URL}/relationships/follow/${user_slug}`;
  
      const headers = {
        Authorization: `${authToken}`, // Ensure authToken has a valid value
      };
  
      if (isFollowing) {
        // Correct handling of headers for DELETE
        await axios.delete(endpoint, { headers });
      } else {
        // POST is already correct
        await axios.post(endpoint, {}, { headers });
      }
  
      setFollowing(!isFollowing);

      // recheck and update the followers / following count
      try {
        const response = await axios.get(`${VITE_API_URL}/user/info/${user_slug}`, {
          headers: {
            Authorization: `${authToken}`,
          },
        });
        const userData = response.data.data;
        setUser(userData);
        setFollowing(userData.followStatus === 'following');
      } catch (error) {
        console.error('Error fetching user details:', error);
      }

    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  if (!authToken && !(userLoading || loading)) {
    return <NotLoggedIn/>;
  }

  return (
    <>
      <LoadingModal isOpen={userLoading || loading}/>
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
              <Typography variant="h5" sx={{fontFamily: '"Besley", serif'}}>{user.fullName}</Typography>
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
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            marginBottom: '30px', 
            fontWeight: 800, 
            fontFamily: '"Besley", serif',
            textAlign: 'center'
          }}
        >
          Blogs by {user?.fullName || user_slug}
        </Typography>

        {blogs.length === 0 ? (
          <Typography variant="h6">No blogs found for this user.</Typography>
        ) : (
          <Grid2 
            container 
            spacing={3} 
            justifyContent="center" 
            alignItems="center"
          >
            {blogs.map((post, index) => (
              <Grid2 item xs={12} sm={6} md={4} key={post.slug}>
                <BlogItem
                  post={post}
                  isEven={index % 2 === 0} // Pass 'isEven' based on the index
                  sx={{ borderRadius: '10px', boxShadow: 3 }}
                />
              </Grid2>
            ))}
          </Grid2>
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
    </>
  );
};

export default UserBlogs;