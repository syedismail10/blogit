import { useState, useMemo } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Register from './pages/Register';
import Blog from './pages/BlogForm';
import BlogItem from './pages/BlogItem';
import BlogList from './pages/BlogList';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode]
  );

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/register" element={<Register darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/create-blog" element={<Blog darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}></Route> 
          <Route path="*" element={<NotFound darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
