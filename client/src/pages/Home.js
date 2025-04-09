import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Paper, 
  Card, 
  CardContent, 
  CardActions,
  Chip,
  Divider,
  useMediaQuery,
  Tab,
  Tabs,
  Link,
  Avatar,
  CircularProgress
} from '@mui/material';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import ForumIcon from '@mui/icons-material/Forum';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Import our new components
import ThreeDHero from '../components/3d/ThreeDHero';
import FeatureSection from '../components/home/FeatureSection';

const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState({
    internships: [],
    projects: [],
    discussions: []
  });
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  // Simulate loading of personalized recommendations
  useEffect(() => {
    const timer = setTimeout(() => {
      setRecommendations({
        internships: [
          {
            id: '1',
            title: 'Frontend Developer Intern',
            company: 'TechSolutions Inc.',
            location: 'Remote',
            duration: '3 months',
            matchScore: 95,
            skills: ['React', 'JavaScript', 'CSS']
          },
          {
            id: '2',
            title: 'Data Science Intern',
            company: 'Analytics Co.',
            location: 'New York, NY',
            duration: '6 months',
            matchScore: 88,
            skills: ['Python', 'Machine Learning', 'SQL']
          }
        ],
        projects: [
          {
            id: '1',
            title: 'Mobile App for Local Businesses',
            creator: 'Sarah Johnson',
            status: 'Looking for team members',
            matchScore: 92,
            skills: ['React Native', 'Firebase', 'UI/UX']
          },
          {
            id: '2',
            title: 'E-learning Platform',
            creator: 'Michael Chen',
            status: 'In planning phase',
            matchScore: 85,
            skills: ['React', 'Node.js', 'MongoDB']
          }
        ],
        discussions: [
          {
            id: '1',
            title: 'Best practices for remote internships',
            author: 'Emily Wilson',
            replies: 24,
            views: 156,
            trending: true
          },
          {
            id: '2',
            title: 'How to showcase project work on your resume',
            author: 'David Thompson',
            replies: 18,
            views: 103,
            trending: false
          }
        ]
      });
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <>
      {/* 3D Hero Section */}
      <ThreeDHero 
        isAuthenticated={isAuthenticated} 
        user={user} 
        getGreeting={getGreeting} 
      />
      
      {/* Feature Section */}
      <FeatureSection isAuthenticated={isAuthenticated} />
      
      <Container maxWidth="lg">
        {/* Personalized Content for Authenticated Users */}
        {isAuthenticated && (
          <>
            <Box sx={{ width: '100%', mb: 4 }}>
              <Tabs 
                value={value} 
                onChange={handleTabChange} 
                variant={isMobile ? "fullWidth" : "standard"}
                centered
                aria-label="content recommendation tabs"
                sx={{
                  mb: 2,
                  '& .MuiTab-root': { fontWeight: 'bold' }
                }}
              >
                <Tab label="Recommended Internships" id="tab-0" aria-controls="tabpanel-0" />
                <Tab label="Project Matches" id="tab-1" aria-controls="tabpanel-1" />
                <Tab label="Trending Discussions" id="tab-2" aria-controls="tabpanel-2" />
              </Tabs>
              <Divider />
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {/* Internships Tab */}
                <Box
                  role="tabpanel"
                  id="tabpanel-0"
                  aria-labelledby="tab-0"
                  hidden={value !== 0}
                >
                  {value === 0 && (
                    <Grid container spacing={3}>
                      {recommendations.internships.map((internship) => (
                        <Grid item xs={12} md={6} key={internship.id}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Card sx={{ mb: 2, borderRadius: 3, position: 'relative', overflow: 'visible' }}>
                              <Box 
                                sx={{ 
                                  position: 'absolute', 
                                  top: -15, 
                                  right: 20, 
                                  bgcolor: 'primary.main',
                                  color: 'white',
                                  borderRadius: '15px',
                                  px: 2,
                                  py: 0.5,
                                  fontWeight: 'bold',
                                  zIndex: 1
                                }}
                              >
                                {internship.matchScore}% Match
                              </Box>
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  {internship.title}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                  {internship.company}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                                  <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {internship.location}
                                  </Typography>
                                  <AccessTimeIcon fontSize="small" sx={{ ml: 2, mr: 0.5, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {internship.duration}
                                  </Typography>
                                </Box>
                                <Box sx={{ mt: 2 }}>
                                  {internship.skills.map((skill, index) => (
                                    <Chip
                                      key={index}
                                      label={skill}
                                      size="small"
                                      sx={{ mr: 0.5, mb: 0.5 }}
                                    />
                                  ))}
                                </Box>
                              </CardContent>
                              <CardActions>
                                <Button size="small" color="primary" component={RouterLink} to={`/internships`}>
                                  View Details
                                </Button>
                                <Button size="small" color="primary">
                                  Apply Now
                                </Button>
                              </CardActions>
                            </Card>
                          </motion.div>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                          <Button 
                            variant="outlined" 
                            component={RouterLink} 
                            to="/internships"
                            sx={{ borderRadius: 3 }}
                          >
                            View All Internships
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </Box>

                {/* Projects Tab */}
                <Box
                  role="tabpanel"
                  id="tabpanel-1"
                  aria-labelledby="tab-1"
                  hidden={value !== 1}
                >
                  {value === 1 && (
                    <Grid container spacing={3}>
                      {recommendations.projects.map((project) => (
                        <Grid item xs={12} md={6} key={project.id}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Card sx={{ mb: 2, borderRadius: 3, position: 'relative', overflow: 'visible' }}>
                              <Box 
                                sx={{ 
                                  position: 'absolute', 
                                  top: -15, 
                                  right: 20, 
                                  bgcolor: 'secondary.main',
                                  color: 'white',
                                  borderRadius: '15px',
                                  px: 2,
                                  py: 0.5,
                                  fontWeight: 'bold',
                                  zIndex: 1
                                }}
                              >
                                {project.matchScore}% Match
                              </Box>
                              <CardContent>
                                <Typography variant="h6" gutterBottom>
                                  {project.title}
                                </Typography>
                                <Typography color="textSecondary" gutterBottom>
                                  Created by: {project.creator}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                                  Status: <Chip label={project.status} size="small" color="primary" />
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                  {project.skills.map((skill, index) => (
                                    <Chip
                                      key={index}
                                      label={skill}
                                      size="small"
                                      sx={{ mr: 0.5, mb: 0.5 }}
                                    />
                                  ))}
                                </Box>
                              </CardContent>
                              <CardActions>
                                <Button size="small" color="primary" component={RouterLink} to={`/projects`}>
                                  View Details
                                </Button>
                                <Button size="small" color="primary">
                                  Join Project
                                </Button>
                              </CardActions>
                            </Card>
                          </motion.div>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                          <Button 
                            variant="outlined" 
                            component={RouterLink} 
                            to="/projects"
                            sx={{ borderRadius: 3 }}
                          >
                            View All Projects
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </Box>

                {/* Discussions Tab */}
                <Box
                  role="tabpanel"
                  id="tabpanel-2"
                  aria-labelledby="tab-2"
                  hidden={value !== 2}
                >
                  {value === 2 && (
                    <Grid container spacing={3}>
                      {recommendations.discussions.map((discussion) => (
                        <Grid item xs={12} key={discussion.id}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Card sx={{ mb: 2, borderRadius: 3 }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Box>
                                    <Typography variant="h6" gutterBottom>
                                      {discussion.title}
                                      {discussion.trending && (
                                        <Chip 
                                          icon={<TrendingUpIcon />} 
                                          label="Trending" 
                                          size="small" 
                                          color="error" 
                                          sx={{ ml: 1 }} 
                                        />
                                      )}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                      <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.8rem' }}>
                                        {discussion.author.charAt(0)}
                                      </Avatar>
                                      <Typography variant="body2" color="text.secondary">
                                        Posted by {discussion.author}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <Box>
                                    <Typography variant="body2" color="text.secondary">
                                      {discussion.replies} replies • {discussion.views} views
                                    </Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                              <CardActions>
                                <Button size="small" color="primary" component={RouterLink} to={`/discussions`}>
                                  Join Discussion
                                </Button>
                              </CardActions>
                            </Card>
                          </motion.div>
                        </Grid>
                      ))}
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                          <Button 
                            variant="outlined" 
                            component={RouterLink} 
                            to="/discussions"
                            sx={{ borderRadius: 3 }}
                          >
                            View All Discussions
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  )}
                </Box>
              </>
            )}
          </>
        )}

        {/* Success Stories Section */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" component="h2" gutterBottom align="center">
              Success Stories
            </Typography>
            <Divider sx={{ mb: 4 }} />
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      height: '100%', 
                      borderRadius: 3,
                      background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      "Found my dream internship in just a week!"
                    </Typography>
                    <Typography variant="body1" paragraph>
                      The platform's matching algorithm recommended me a perfect opportunity at a tech startup that aligned with my skills.
                    </Typography>
                    <Typography variant="subtitle2" color="primary">
                      — Alex Johnson, Software Engineering Student
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={4}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      height: '100%', 
                      borderRadius: 3,
                      background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      "Built an amazing portfolio project with a talented team"
                    </Typography>
                    <Typography variant="body1" paragraph>
                      I connected with three other students and together we created a project that impressed recruiters during interviews.
                    </Typography>
                    <Typography variant="subtitle2" color="primary">
                      — Maria Garcia, UX Design Student
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={4}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      height: '100%', 
                      borderRadius: 3,
                      background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      "The forum discussions helped me prepare for interviews"
                    </Typography>
                    <Typography variant="body1" paragraph>
                      I learned so much from the community about what companies look for and how to present my projects effectively.
                    </Typography>
                    <Typography variant="subtitle2" color="primary">
                      — David Chen, Data Science Student
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Box>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <Box 
            sx={{ 
              mt: 8, 
              mb: 8, 
              textAlign: 'center',
              background: 'linear-gradient(145deg, #6a11cb 0%, #2575fc 100%)',
              py: 6,
              px: 3,
              borderRadius: 4,
              color: 'white',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Launch Your Career?
            </Typography>
            <Typography variant="h6" component="p" gutterBottom sx={{ mb: 4, maxWidth: 800, mx: 'auto' }}>
              Join thousands of students who found internships, built projects, and connected with like-minded collaborators.
            </Typography>
            {!isAuthenticated && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/register"
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main', 
                    '&:hover': { 
                      bgcolor: 'rgba(255,255,255,0.9)', 
                    },
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                  Get Started Now
                </Button>
              </motion.div>
            )}
          </Box>
        </motion.div>

        {/* Footer Navigation */}
        <Box sx={{ mt: 8, mb: 4 }}>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link component={RouterLink} to="/internships" color="inherit" underline="hover">
                  Browse Internships
                </Link>
                <Link component={RouterLink} to="/projects" color="inherit" underline="hover">
                  Find Projects
                </Link>
                <Link component={RouterLink} to="/discussions" color="inherit" underline="hover">
                  Join Discussions
                </Link>
                {isAuthenticated ? (
                  <Link component={RouterLink} to="/profile" color="inherit" underline="hover">
                    My Profile
                  </Link>
                ) : (
                  <Link component={RouterLink} to="/register" color="inherit" underline="hover">
                    Create Account
                  </Link>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Resources
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link component={RouterLink} to="#" color="inherit" underline="hover">
                  Resume Building Tips
                </Link>
                <Link component={RouterLink} to="#" color="inherit" underline="hover">
                  Interview Preparation
                </Link>
                <Link component={RouterLink} to="#" color="inherit" underline="hover">
                  Project Portfolio Guide
                </Link>
                <Link component={RouterLink} to="#" color="inherit" underline="hover">
                  Career Development
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                About Us
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link component={RouterLink} to="#" color="inherit" underline="hover">
                  Our Mission
                </Link>
                <Link component={RouterLink} to="#" color="inherit" underline="hover">
                  Privacy Policy
                </Link>
                <Link component={RouterLink} to="#" color="inherit" underline="hover">
                  Terms of Service
                </Link>
                <Link component={RouterLink} to="#" color="inherit" underline="hover">
                  Contact Us
                </Link>
              </Box>
            </Grid>
          </Grid>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 4 }}>
            © {new Date().getFullYear()} Internship & Project Collaboration Hub. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default Home; 