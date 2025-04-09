import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Button,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import ForumIcon from '@mui/icons-material/Forum';
import SearchIcon from '@mui/icons-material/Search';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const FeatureSection = ({ isAuthenticated }) => {
  const theme = useTheme();
  
  // Track if primary images fail to load
  const [imageLoadStatus, setImageLoadStatus] = useState({
    internships: { primary: true, fallback: true },
    projects: { primary: true, fallback: true },
    discussions: { primary: true, fallback: true }
  });
  
  const handleImageError = (featureKey, imageType) => {
    setImageLoadStatus(prev => ({
      ...prev,
      [featureKey]: { 
        ...prev[featureKey],
        [imageType]: false 
      }
    }));
  };
  
  const features = [
    {
      key: "internships",
      title: "Find Internships",
      description: "Discover internship opportunities that perfectly match your skills, interests, and career goals.",
      primaryIcon: <WorkIcon style={{ fontSize: 100, color: theme.palette.primary.main }} />,
      secondaryIcon: <SearchIcon style={{ fontSize: 100, color: theme.palette.primary.main }} />,
      link: "/internships",
      buttonText: "Browse Internships",
      primaryImage: "url('https://cdni.iconscout.com/illustration/premium/thumb/job-search-3678561-3098702.png')",
      fallbackImage: "url('https://img.freepik.com/free-vector/job-interview-process-concept-illustration_114360-2197.jpg?w=826&t=st=1696762379~exp=1696762979~hmac=7b97f2a6b65d46cddad8fb5b9b1a02449c05a31d3ed1e8f04dc99d6bad9c43a4')",
    },
    {
      key: "projects",
      title: "Collaborate on Projects",
      description: "Join exciting projects or find team members to collaborate on your own ideas and build your portfolio.",
      primaryIcon: <GroupWorkIcon style={{ fontSize: 100, color: theme.palette.primary.main }} />,
      secondaryIcon: <PeopleAltIcon style={{ fontSize: 100, color: theme.palette.primary.main }} />,
      link: "/projects",
      buttonText: "Explore Projects",
      primaryImage: "url('https://cdni.iconscout.com/illustration/premium/thumb/team-working-together-on-project-5691620-4759773.png')",
      fallbackImage: "url('https://img.freepik.com/free-vector/team-project-management-teamwork-collaboration_501813-384.jpg?w=826&t=st=1696762419~exp=1696763019~hmac=3c89b75c2d0b8d255fbe8dc10439c5824bcfdadbe38ab7d0e6285bc795123a0b')",
    },
    {
      key: "discussions",
      title: "Join Discussions",
      description: "Connect with peers in topic-based discussion rooms to share knowledge and get advice.",
      primaryIcon: <ForumIcon style={{ fontSize: 100, color: theme.palette.primary.main }} />,
      secondaryIcon: <QuestionAnswerIcon style={{ fontSize: 100, color: theme.palette.primary.main }} />,
      link: "/discussions",
      buttonText: "Join Discussions",
      primaryImage: "url('https://cdni.iconscout.com/illustration/premium/thumb/community-discussion-3678564-3098705.png')",
      fallbackImage: "url('https://img.freepik.com/free-vector/organic-flat-people-business-training-illustration_23-2148909572.jpg?w=826&t=st=1696762443~exp=1696763043~hmac=1c4e638af10781e275bcdb695c62567adc3ad5a2025634a5e52de4e73c2066eb')",
    }
  ];

  // Function to determine which image to use based on load status
  const getFeatureImage = (feature) => {
    if (imageLoadStatus[feature.key].primary) {
      return feature.primaryImage;
    } else if (imageLoadStatus[feature.key].fallback) {
      return feature.fallbackImage;
    } else {
      // If both images fail, use a radial gradient with the icon
      return null;
    }
  };
  
  // Function to get appropriate icon based on image loading status
  const getFeatureIcon = (feature) => {
    if (!imageLoadStatus[feature.key].primary && !imageLoadStatus[feature.key].fallback) {
      return feature.primaryIcon;
    } else {
      return null;
    }
  };

  return (
    <Box 
      component="section" 
      sx={{ 
        py: 8,
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(9,9,121,0.05) 100%)' 
          : 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(240,242,255,1) 100%)'
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h2" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ 
              mb: 6,
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontWeight: 'bold'
            }}
          >
            Everything You Need to Launch Your Career
          </Typography>
        </motion.div>

        <Grid container spacing={4} alignItems="stretch">
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                style={{ height: '100%' }}
              >
                <Paper 
                  elevation={4} 
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    p: 3,
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 8
                    }
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {/* Primary image loader (hidden) */}
                    <img 
                      src={feature.primaryImage.replace(/url\(['"](.+)['"]\)/, '$1')} 
                      alt="" 
                      style={{ display: 'none' }} 
                      onError={() => handleImageError(feature.key, 'primary')}
                    />
                    
                    {/* Fallback image loader (hidden) */}
                    <img 
                      src={feature.fallbackImage.replace(/url\(['"](.+)['"]\)/, '$1')} 
                      alt="" 
                      style={{ display: 'none' }} 
                      onError={() => handleImageError(feature.key, 'fallback')}
                    />
                    
                    {getFeatureImage(feature) ? (
                      <Box 
                        sx={{ 
                          height: 200, 
                          mb: 2, 
                          display: 'flex', 
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundImage: getFeatureImage(feature),
                          backgroundSize: 'contain',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            filter: 'brightness(1.1)',
                          }
                        }}
                      />
                    ) : (
                      <Box 
                        sx={{ 
                          height: 200, 
                          mb: 2, 
                          display: 'flex', 
                          justifyContent: 'center',
                          alignItems: 'center',
                          background: `radial-gradient(circle, ${theme.palette.primary.light}15 0%, ${theme.palette.background.paper} 100%)`,
                          borderRadius: 2,
                        }}
                      >
                        {feature.primaryIcon}
                      </Box>
                    )}
                  </motion.div>
                  
                  <Typography 
                    variant="h4" 
                    component="h3" 
                    gutterBottom
                    sx={{ 
                      fontSize: { xs: '1.5rem', md: '1.75rem' },
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    paragraph
                    sx={{ 
                      textAlign: 'center',
                      mb: 3,
                      flexGrow: 1
                    }}
                  >
                    {feature.description}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={feature.link}
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ 
                      alignSelf: 'center',
                      borderRadius: 3,
                      px: 3,
                      py: 1,
                      fontWeight: 'medium'
                    }}
                  >
                    {feature.buttonText}
                  </Button>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeatureSection; 