import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Container, TextField, Button, Box, Typography } from '@mui/material';

const BlogForm = ({ postToEdit, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [blog, setBlog] = useState(null); // Null at the beginning

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setBody(postToEdit.body);
    }
  }, [postToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBlog = { title, body };
    // onSave(newBlog);
    setBlog(newBlog); // Store the new blog in state
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

          {/* MDEditor for Body */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Body
            </Typography>
            <MDEditor value={body} onChange={(value) => setBody(value)} preview="edit" />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end'}}>
            <Button type="submit" variant="contained" color="primary" sx= {{backgroundColor: 'black',color:'white'}}>
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
            <MDEditor.Markdown source={blog.body} />
          </Box>
        </Container>
      )}
    </>
  );
};

export default BlogForm;
