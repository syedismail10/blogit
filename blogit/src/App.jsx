// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/Home';
// import AboutPage from './pages/About';
import LoginPage from './pages/Login';
import CreateBlogPage from './pages/BlogForm';
import Register from './pages/Register';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogPage';
import UserPage from './pages/UserPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import UserBlogs from './pages/UserBlogs';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/about" element={<AboutPage />} /> */}
        <Route path="/user" element= {<UserPage/>}></Route>
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-blog" element={<CreateBlogPage />} />
        <Route path='/blog' element={<BlogList/>}/>
        <Route path='/admin' element={<AdminDashboard/>}></Route>
        <Route path='/admin-login' element= {<AdminLogin/>}></Route>
        <Route path="/user/:user_slug" element={<UserBlogs />} />

      </Routes>
    </>
  );
};

export default App;
