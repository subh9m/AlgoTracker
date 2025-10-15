import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Pages
import HomePage from './pages/HomePage';
import AlgorithmPage from './pages/AlgorithmPage';

// Import Global Components
import GlobalStyles from './components/GlobalStyles';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import PasswordScreen from './components/PasswordScreen';

const CORRECT_PASSWORD = import.meta.env.VITE_APP_PASSWORD;
const AUTH_KEY = 'isAuthenticated';

function App() {
  // Check sessionStorage for auth status when the app first loads
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem(AUTH_KEY) === 'true');

  const handleLogin = (password) => {
    if (password === CORRECT_PASSWORD) {
      // If login is successful, set the flag in sessionStorage
      sessionStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // If the user is NOT authenticated, render only the password screen.
  if (!isAuthenticated) {
    return (
      <>
        <GlobalStyles />
        <PasswordScreen onLogin={handleLogin} />
      </>
    );
  }

  // If the user IS authenticated, render the full application.
  return (
    <>
      <GlobalStyles />
      <Header />
      <ScrollToTop />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/algorithm/:slug" element={<AlgorithmPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;