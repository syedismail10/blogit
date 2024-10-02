// App.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/Home';
// import AboutPage from './pages/About';
import LoginPage from './pages/Login';
import CreateBlogPage from './pages/BlogForm';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/about" element={<AboutPage />} /> */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-blog" element={<CreateBlogPage />} />
      </Routes>
    </>
  );
};

export default App;
