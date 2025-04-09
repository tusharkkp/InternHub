import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector, useDispatch } from 'react-redux';
import PrivateRoute from './components/routing/PrivateRoute';
import { loadUser } from './store/slices/authSlice';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Projects from './pages/Projects';
import ProjectDetail from './components/project/ProjectDetail';
import Internships from './pages/Internships';
import Discussions from './pages/Discussions';
import MyWorkspace from './pages/MyWorkspace';
import Search from './pages/Search';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import ChatBotWidget from './components/chatbot/ChatBotWidget';
import PersonalityMatching from './pages/PersonalityMatching';
import Settings from './pages/Settings';
import Teammates from './pages/Teammates';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    // Default to system preference if available
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    dispatch(loadUser())
      .catch(error => {
        console.error("Error loading user:", error);
        // For development, we still want to have some user data
        if (process.env.NODE_ENV === 'development') {
          const mockToken = 'mock-dev-token';
          localStorage.setItem('token', mockToken);
        }
      });
  }, [dispatch]);

  const theme = useMemo(() => {
    return createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: '#5e72e4',
        },
        secondary: {
          main: '#ff7675',
        },
        background: {
          default: darkMode ? '#1a202c' : '#f8f9fa',
          paper: darkMode ? '#2d3748' : '#ffffff',
        },
      },
      shape: {
        borderRadius: 8,
      },
      typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontWeight: 700,
        },
        h2: {
          fontWeight: 700,
        },
        h3: {
          fontWeight: 600,
        },
        h4: {
          fontWeight: 600,
        },
        h5: {
          fontWeight: 500,
        },
        h6: {
          fontWeight: 500,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              fontWeight: 500,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.08)',
            },
          },
        },
      },
    });
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode.toString());
      return newMode;
    });
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/profile/:id" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/my-workspace" element={
              <PrivateRoute>
                <MyWorkspace />
              </PrivateRoute>
            } />
            <Route path="/teammates" element={
              <PrivateRoute>
                <Teammates />
              </PrivateRoute>
            } />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/internships" element={<Internships />} />
            <Route path="/internships/:id" element={<Internships />} />
            <Route path="/discussions" element={<Discussions />} />
            <Route path="/discussions/:id" element={<Discussions />} />
            <Route path="/search" element={<Search />} />
            <Route path="/help" element={<Help />} />
            <Route path="/settings" element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } />
            <Route path="/personality-matching" element={
              <PrivateRoute>
                <PersonalityMatching />
              </PrivateRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <ChatBotWidget />
      </div>
    </ThemeProvider>
  );
}

export default App; 