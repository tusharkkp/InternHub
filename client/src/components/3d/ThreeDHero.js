import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Box, Typography, Button, useTheme, useMediaQuery, CircularProgress, Container } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import AnimatedScene from './AnimatedScene';

const LoadingFallback = () => (
  <Box
    sx={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(0,0,0,0.05)',
    }}
  >
    <CircularProgress size={60} thickness={4} />
  </Box>
);

const ThreeDHero = ({ isAuthenticated, user, getGreeting }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '100vh', lg: '85vh' },
        minHeight: { xs: '550px', md: '650px' },
        overflow: 'hidden',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg, rgba(26,32,44,1) 0%, rgba(22,28,36,1) 100%)'
          : 'linear-gradient(180deg, rgba(248,249,250,1) 0%, rgba(240,242,255,1) 100%)',
      }}
    >
      {/* 3D Animation Background */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.8,
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            dpr={[1, 2]}
            style={{ background: 'transparent' }}
          >
            <AnimatedScene />
            <OrbitControls 
              enableZoom={false} 
              enablePan={false}
              enableRotate={true}
              autoRotate={true}
              autoRotateSpeed={0.5}
              rotateSpeed={0.5}
            />
          </Canvas>
        </Suspense>
      </Box>

      {/* Content Overlay */}
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          zIndex: 2,
          py: 8,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '60%' } }}>
          {isAuthenticated ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  textShadow: theme.palette.mode === 'dark' ? '0 0 15px rgba(255,255,255,0.2)' : 'none',
                }}
              >
                {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}!
              </Typography>
              <Typography 
                variant="h5" 
                component="p" 
                color="text.secondary"
                gutterBottom
                sx={{ mb: 4, maxWidth: '90%' }}
              >
                Your dashboard for internships, projects, and connections is ready.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    size="large"
                    component={RouterLink}
                    to="/internships"
                    sx={{ 
                      borderRadius: 3, 
                      px: 3, 
                      py: 1.5,
                      fontSize: '1.1rem',
                      boxShadow: theme.shadows[8]
                    }}
                  >
                    Find Internships
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    component={RouterLink}
                    to="/projects"
                    sx={{ 
                      borderRadius: 3, 
                      px: 3, 
                      py: 1.5,
                      fontSize: '1.1rem',
                      borderWidth: 2
                    }}
                  >
                    Explore Projects
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="h1" 
                component="h1"
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
                  lineHeight: 1.2,
                  mb: 2,
                  background: 'linear-gradient(45deg, #5e72e4 30%, #2575fc 90%)',
                  backgroundClip: 'text',
                  textFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: theme.palette.mode === 'dark' ? '0 0 25px rgba(94,114,228,0.3)' : 'none',
                }}
              >
                Connect. Collaborate. Create.
              </Typography>
              <Typography 
                variant="h5" 
                component="p"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: '90%' }}
              >
                Join a community where students find internships, collaborate on projects, and build their careers together.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    size="large"
                    component={RouterLink}
                    to="/register"
                    sx={{ 
                      borderRadius: 3, 
                      px: 4, 
                      py: 1.5,
                      fontSize: '1.1rem',
                      boxShadow: '0 8px 16px rgba(94, 114, 228, 0.3)',
                      background: 'linear-gradient(45deg, #5e72e4 30%, #2575fc 90%)',
                    }}
                  >
                    Get Started
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    component={RouterLink}
                    to="/login"
                    sx={{ 
                      borderRadius: 3, 
                      px: 4, 
                      py: 1.5,
                      fontSize: '1.1rem',
                      borderWidth: 2
                    }}
                  >
                    Sign In
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ThreeDHero; 