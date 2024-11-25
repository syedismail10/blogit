import { useState, useEffect, useContext } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Container, TextField, Button, Box, Typography, Chip } from '@mui/material';
import { VITE_API_URL } from '../config';
import { useTitle } from '../services/useTitle';
import { useThemeContext } from '../contexts/ThemeContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import NotLoggedIn from './NotLoggedIn';
import { AuthContext } from '../contexts/AuthContext';
import LoadingModal from '../components/LoadingModal';

const BlogForm = ({ postToEdit, onSave, onCancel, userSlug }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [media, setMedia] = useState(null); // To store the file
  const [blog, setBlog] = useState(null); // Null at the beginning
  const { darkMode, toggleDarkMode } = useThemeContext();
  const [fileName, setFileName] = useState('');
  const navigate = useNavigate();
  const { authToken } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  useTitle("Create Blog | BlogIt");

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setBody(postToEdit.body);
      setMedia(null); // Reset media if editing an existing post
    }
  }, [postToEdit]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setMedia(file);
    }
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    if(title == "") {
      toast.error("Please fill in the title!")
      return;
    }

    if(body == "") {
      toast.error("Please fill in the body!")
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', body);
    // formData.append('user_slug', userSlug);
    if (media) {
      formData.append('media', media); // Add the file to the form data
    }
    
    const authToken = localStorage.getItem('authToken'); // Retrieve the auth token from local storage
    
    try {
      const response = await fetch(`${VITE_API_URL}/blog/create`, { // Adjust the API endpoint accordingly
        method: 'POST',
        headers: {
          'Authorization': `${authToken}`, // Add the Authorization header
        },
        body: formData, // Send FormData instead of JSON
      });

      if (response.ok) {
        const result = await response.json();
        setBlog(result); // Store the saved blog to display after saving
        navigate('/feed');

      } else {
        console.error('Failed to save blog');
      }
    } catch (error) {
      console.error('Error posting blog:', error);
    }
    setIsLoading(false);
  };

  if (!authToken && !isLoading) {
    return <NotLoggedIn/>;
  }


  return (
    <>
      <LoadingModal isOpen={isLoading}/>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        transition: Bounce
      />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom 
          sx={{ 
            marginBottom: '30px', 
            fontWeight: 800, 
            fontFamily: '"Besley", serif' 
          }}
        >
          {postToEdit ? 'Edit Post' : 'Add New Post'}
        </Typography>
        
        

        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            sx={{ mb: 3 }}
          />

          {/* Media File Input */}
          <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
            <Typography variant="h6" gutterBottom>
              Media
            </Typography>
            <label htmlFor="file-upload">
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }} // Hide the default input
              />
              <Button
                variant="contained"
                component="span"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'white',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                }}
              >
                Upload Image
              </Button>
            </label>
            {/* Show file name if a file is selected */}
            {fileName && (
              <Chip
                label={`(${fileName})`}
                sx={{
                  mt: 1.5, // Margin between the button and chip
                  alignSelf: 'flex-start', // Align to the left
                }}
              />
            )}
          </Box>

          {/* MDEditor for Body */}
          <Box sx={{ mb: 3 }} data-color-mode={darkMode ? 'dark' : 'light'}>
            <Typography variant="h6" gutterBottom>
              Body *
            </Typography>
            <MDEditor value={body} onChange={(value) => setBody(value)} preview="edit" />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end'}}>
            <Button type="submit" variant="contained" color="primary" sx= {{backgroundColor: darkMode ? 'white' : 'black', color: darkMode ? 'black' : 'white'}}>
              Save Post
            </Button>
            {onCancel && (
              <Button variant="outlined" color="secondary" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </Box>
        </form>
      </Container>

      {/* Display the saved blog */}
      {blog && (
        <Container sx={{ mt: 4 }}>
          <Typography variant="h4">{blog.title}</Typography>
          <Box sx={{ mt: 2 }}>
            <MDEditor.Markdown source={blog.description} />
          </Box>
        </Container>
      )}
    </>
  );
};

export default BlogForm;
