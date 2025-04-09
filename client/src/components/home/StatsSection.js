import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Grid, Typography, useTheme } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import ForumIcon from '@mui/icons-material/Forum';
import SchoolIcon from '@mui/icons-material/School';

// Animated counter component
const Counter = ({ end, duration = 2, decimals = 0, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const value = Math.floor(progress * end);
      
      setCount(value);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      }
    };
    
    animationFrame = requestAnimationFrame(step);
    
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return (
    <Typography 
      ref={countRef} 
      variant="h2" 
      component="div" 
      sx={{ fontWeight: 700 }}
    >
      {count.toLocaleString(undefined, { 
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}{suffix}
    </Typography>
  );
};

const StatItem = ({ icon, count, label, suffix = '', delay = 0 }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      <Box 
        sx={{ 
          textAlign: 'center',
          py: 4,
          px: 2,
        }}
      >
        <Box 
          sx={{ 
            display: 'inline-flex',
            p: 2,
            borderRadius: '50%',
            mb: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
            boxShadow: '0 8px 16px rgba(41, 98, 255, 0.3)',
          }}
        >
          {icon}
        </Box>
        <Counter end={count} suffix={suffix} />
        <Typography 
          variant="h6" 
          component="div" 
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {label}
        </Typography>
      </Box>
    </motion.div>
  );
};

const StatsSection = () => {
  const theme = useTheme();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0, 1, 1, 0]);
  
  return (
    <Box 
      ref={containerRef}
      sx={{ 
        py: 10, 
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Parallax shapes for background */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', zIndex: 0 }}>
        <motion.div style={{ y, opacity, position: 'absolute', top: '10%', left: '5%' }}>
          <Box 
            sx={{ 
              width: 80, 
              height: 80, 
              borderRadius: 4, 
              transform: 'rotate(15deg)', 
              background: `linear-gradient(135deg, ${theme.palette.primary.light}50 0%, ${theme.palette.primary.main}30 100%)`,
            }} 
          />
        </motion.div>
        <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]), opacity, position: 'absolute', top: '60%', right: '10%' }}>
          <Box 
            sx={{ 
              width: 120, 
              height: 120, 
              borderRadius: '50%', 
              background: `linear-gradient(135deg, ${theme.palette.secondary.light}40 0%, ${theme.palette.secondary.main}20 100%)`,
            }} 
          />
        </motion.div>
        <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -80]), opacity, position: 'absolute', bottom: '15%', left: '15%' }}>
          <Box 
            sx={{ 
              width: 100, 
              height: 100, 
              borderRadius: 8, 
              transform: 'rotate(45deg)', 
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}30 0%, ${theme.palette.secondary.dark}20 100%)`,
            }} 
          />
        </motion.div>
      </Box>
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                backgroundImage: 'linear-gradient(45deg, #2962FF, #6a11cb)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Our Growing Community
            </Typography>
            <Typography 
              variant="h6" 
              component="p"
              color="text.secondary"
              sx={{ maxWidth: 700, mx: 'auto' }}
            >
              Join thousands of students and companies who are already part of our platform
            </Typography>
          </motion.div>
        </Box>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatItem 
              icon={<WorkIcon sx={{ fontSize: 40, color: 'white' }} />}
              count={5000}
              label="Internship Opportunities"
              delay={0.1}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatItem 
              icon={<GroupIcon sx={{ fontSize: 40, color: 'white' }} />}
              count={1200}
              label="Collaborative Projects"
              delay={0.2}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatItem 
              icon={<ForumIcon sx={{ fontSize: 40, color: 'white' }} />}
              count={25000}
              label="Community Discussions"
              delay={0.3}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatItem 
              icon={<SchoolIcon sx={{ fontSize: 40, color: 'white' }} />}
              count={8000}
              label="Students Connected"
              delay={0.4}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StatsSection; 