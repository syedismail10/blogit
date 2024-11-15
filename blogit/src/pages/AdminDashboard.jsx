import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import BlockUser from '../components/BlockUser';
import DeleteBlog from '../components/DeleteBlog';
import DeleteComment from '../components/DeleteComment';
import PromoteUser from '../components/PromoteUser';
import { useTitle } from '../services/useTitle';

const AdminDashboard = () => {

  useTitle("Admin Dashboard | BlogIt");

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Block User
            </Typography>
            <BlockUser />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Delete Blog
            </Typography>
            <DeleteBlog />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Delete Comment
            </Typography>
            <DeleteComment />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6" gutterBottom>
              Promote User
            </Typography>
            <PromoteUser />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
