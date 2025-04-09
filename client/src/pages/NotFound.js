import React from 'react';
import { Container, Typography, Button, Box, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          py: 6,
          px: 4,
          mt: 8,
          mb: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ErrorOutlineIcon 
            sx={{ 
              fontSize: 100, 
              color: 'primary.main',
              mb: 2
            }} 
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            404
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Typography variant="h4" component="h2" gutterBottom>
            Page Not Found
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 600, mb: 4 }}>
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </Typography>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="contained"
            component={RouterLink}
            to="/"
            size="large"
            sx={{ 
              mt: 2,
              borderRadius: 2,
              px: 4,
              py: 1
            }}
          >
            Back to Home
          </Button>
        </motion.div>
      </Paper>
    </Container>
  );
};

export default NotFound; 