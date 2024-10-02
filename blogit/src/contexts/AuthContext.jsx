// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(() => {
    const token = localStorage.getItem('authToken');
    const expiration = localStorage.getItem('tokenExpiration');
    if (token && expiration) {
      const now = new Date().getTime();
      if (now > expiration) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenExpiration');
        return null;
      }
      return token;
    }
    return null;
  });

  const [tokenExpiration, setTokenExpiration] = useState(localStorage.getItem('tokenExpiration'));
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem('darkMode')) || false);

  const login = (token, expiresIn = 3600) => {
    const expirationTime = new Date().getTime() + expiresIn * 1000;
    setAuthToken(token);
    setTokenExpiration(expirationTime);
    localStorage.setItem('authToken', token);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
  };

  const logout = () => {
    setAuthToken(null);
    setTokenExpiration(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiration');
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  useEffect(() => {
    if (tokenExpiration) {
      const now = new Date().getTime();
      if (now > tokenExpiration) {
        logout();
      }
    }
  }, [tokenExpiration]);

  return (
    <AuthContext.Provider value={{ authToken, login, logout, darkMode, toggleDarkMode }}>
      {children}
    </AuthContext.Provider>
  );
};
