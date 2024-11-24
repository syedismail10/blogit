import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // Adjust the import path if necessary
import { ThemeProviderWrapper } from './contexts/ThemeContext'; // Adjust the import path if necessary

// Get the root element
const rootElement = document.getElementById('root');

// Create the root using ReactDOM.createRoot
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProviderWrapper>
          <App />
        </ThemeProviderWrapper>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
