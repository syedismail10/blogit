import React from 'react';
import HomePage from './pages/Home';
import { AuthProvider } from './contexts/AuthContext'; // Correct import of AuthProvider
import { ThemeProvider } from './contexts/ThemeContext'; // Correct import of ThemeProvider

function App() {
  return (
    <AuthProvider> {/* Use AuthProvider here */}
      <ThemeProvider> {/* Use ThemeProvider here */}
        <HomePage />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
