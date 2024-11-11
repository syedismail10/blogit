import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import { VITE_API_URL } from '../config';

const BlogForm = ({ postToEdit, onSave, onCancel, userSlug }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [media, setMedia] = useState(null); // To store the file
  const [blog, setBlog] = useState(null); // Null at the beginning

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setBody(postToEdit.body);
      setMedia(null); // Reset media if editing an existing post
    }
  }, [postToEdit]);

  const handleFileChange = (e) => {
    setMedia(e.target.files[0]); // Store the selected file
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

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
      // onSave(result); // Trigger any additional save actions
    } else {
      console.error('Failed to save blog');
    }
  } catch (error) {
    console.error('Error posting blog:', error);
  }
};


  return (
    <>
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
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
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Media
            </Typography>
            <input
              type="file"
              accept="image/*" // You can customize the file types allowed
              onChange={handleFileChange}
              required={!postToEdit} // Only require media for new posts
            />
          </Box>

          {/* MDEditor for Body */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Body
            </Typography>
            <MDEditor value={body} onChange={(value) => setBody(value)} preview="edit" />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end'}}>
            <Button type="submit" variant="contained" color="primary" sx= {{backgroundColor: 'black', color:'white'}}>
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
