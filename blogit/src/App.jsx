// import React from 'react';
import HomePage from './pages/Home';
import { AuthContext } from './contexts/AuthContext';
import ThemeContext from './contexts/ThemeContext';

function App() {
  return (
    <AuthContext>
      <ThemeContext>
        <HomePage />
      </ThemeContext>
    </AuthContext>
  );
}

export default App;
