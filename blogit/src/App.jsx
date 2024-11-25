// App.js
import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import CreateBlogPage from './pages/BlogForm';
import Register from './pages/Register';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogPage';
import UserPage from './pages/UserPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import UserBlogs from './pages/UserBlogs';
import UserFeed from './pages/UserFeed';
import EditProfile from './pages/EditProfile';
import NotFound from './pages/NotFound';
import { AuthContext } from './contexts/AuthContext';

const App = () => {
  const { authToken } = useContext(AuthContext);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={authToken ? <UserFeed /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/create-blog" element={<CreateBlogPage />} />
        <Route path="/user/:user_slug" element={<UserBlogs />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/feed" element={<UserFeed />} />
        <Route path="/edit" element={<EditProfile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
