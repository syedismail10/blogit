// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => {
    const token = localStorage.getItem('authToken');
    const expiration = localStorage.getItem('tokenExpiration');
    if (token && expiration) {
      const now = new Date().getTime();
      if (now > expiration) {
        // Token expired, remove it
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiration');
        return null;
      }
      return token;
    }
    return null;
  });

  const [tokenExpiration, setTokenExpiration] = useState(localStorage.getItem('tokenExpiration'));
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem('darkMode')) || false;
  });

  // Function to log in (save the token and expiration)
  const login = (token, expiresIn = 3600) => {
    const expirationTime = new Date().getTime() + expiresIn * 1000; // expiration time in milliseconds
    setAuthToken(token);
    setTokenExpiration(expirationTime);

    localStorage.setItem('authToken', token);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
  };

  // Function to log out (clear the token and expiration)
  const logout = () => {
    setAuthToken(null);
    setTokenExpiration(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiration');
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  // Auto-logout if token expires
  useEffect(() => {
    if (tokenExpiration) {
      const now = new Date().getTime();
      if (now > tokenExpiration) {
        logout(); // Logout if expired
      }
    }
  }, [tokenExpiration]);

  return (
    <AuthContext.Provider value={{ authToken, login, logout, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};
