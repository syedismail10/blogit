// App.js
import React, { useContext, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/Home';
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

  const protect = (route) => {
    return authToken ? route : <Login/>;
  }

  return (
    <>
      <Navbar />
      {/* Routes */}
      <Routes>

        <Route path="/" element={authToken ? <UserFeed/> : <Login/>} />
        <Route path="/user" element= {protect(<UserPage/>)}></Route>
        <Route path="/blog/:slug" element={protect(<BlogDetail />)} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-blog" element={protect(<CreateBlogPage />)} />
        <Route path='/blog' element={protect(<BlogList/>)}/>
        <Route path='/admin-dashboard' element={protect(<AdminDashboard/>)}></Route>
        <Route path='/admin-login' element= {<AdminLogin/>}></Route>
        <Route path="/user/:user_slug" element={protect(<UserBlogs />)} />
        <Route path="/feed" element={protect(<UserFeed />)} />
        <Route path="/edit" element= {protect(<EditProfile/>)}></Route>

        {/* Wildcard route for 404 Page */} 
        <Route
          path="*"
          element={<NotFound />}
        />


      </Routes>
    </>
  );
};

export default App;
