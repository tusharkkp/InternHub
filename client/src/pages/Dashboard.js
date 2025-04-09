import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Avatar, 
  Chip, 
  Card, 
  CardContent, 
  CardHeader, 
  IconButton, 
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Work as WorkIcon, 
  Group as GroupIcon, 
  Forum as ForumIcon, 
  Bookmark as BookmarkIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  LocationOn as LocationIcon,
  Share as ShareIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Custom styled components
const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 28,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 3),
  marginRight: theme.spacing(2),
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none',
  }
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  minWidth: 100,
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  borderRadius: theme.shape.borderRadius,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  }
}));

const TrendingItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  }
}));

const Dashboard = () => {
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [greetingTime, setGreetingTime] = useState('');
  
  useEffect(() => {
    // Set greeting based on time of day
    const hours = new Date().getHours();
    if (hours < 12) setGreetingTime('Good Morning');
    else if (hours < 18) setGreetingTime('Good Afternoon');
    else setGreetingTime('Good Evening');
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Mock data
  const recommendedInternships = [
    {
      id: 1,
      title: 'Frontend Developer Intern',
      company: 'TechCorp Inc.',
      location: 'Remote',
      logo: 'https://randomuser.me/api/portraits/men/35.jpg',
      matchPercentage: 95,
      skills: ['React', 'JavaScript', 'HTML/CSS']
    },
    {
      id: 2,
      title: 'UI/UX Design Intern',
      company: 'DesignStudio',
      location: 'Hybrid',
      logo: 'https://randomuser.me/api/portraits/women/68.jpg',
      matchPercentage: 87,
      skills: ['Figma', 'UI Design', 'Wireframing']
    }
  ];
  
  const recommendedProjects = [
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'Building a modern e-commerce platform with React and Node.js',
      creator: {
        name: 'Alex Johnson',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      teamSize: 4,
      openRoles: ['Frontend Developer', 'UI Designer'],
      skills: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 2,
      title: 'AI Chat Application',
      description: 'Developing an AI-powered chat app with real-time capabilities',
      creator: {
        name: 'Sarah Miller',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      teamSize: 3,
      openRoles: ['Backend Developer', 'ML Engineer'],
      skills: ['Python', 'TensorFlow', 'Socket.io', 'React']
    }
  ];
  
  const trendingTopics = [
    {
      id: 1,
      title: 'The Rise of AI in Web Development',
      author: 'Tech Insights',
      time: '2 hours ago',
      reads: '5.2K',
      avatar: 'https://randomuser.me/api/portraits/men/85.jpg'
    },
    {
      id: 2,
      title: 'Remote Work Trends for 2025',
      author: 'Future Workplace',
      time: '5 hours ago',
      reads: '3.8K',
      avatar: 'https://randomuser.me/api/portraits/women/76.jpg'
    },
    {
      id: 3,
      title: 'Learning Paths for Junior Developers',
      author: 'Code Academy',
      time: 'Yesterday',
      reads: '10.1K',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg'
    }
  ];
  
  const userStats = [
    { label: 'Profile Views', value: 238, icon: <TrendingUpIcon color="primary" fontSize="large" /> },
    { label: 'Internship Matches', value: 12, icon: <WorkIcon color="secondary" fontSize="large" /> },
    { label: 'Project Matches', value: 8, icon: <GroupIcon color="success" fontSize="large" /> },
  ];
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Greeting Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {greetingTime}, {isAuthenticated ? user.name.split(' ')[0] : 'Guest'}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Here's what's happening with your job search and connections.
        </Typography>
        
        <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap' }}>
          <ActionButton 
            variant="contained" 
            color="primary" 
            startIcon={<WorkIcon />}
            component={Link}
            to="/internships"
          >
            Find Internships
          </ActionButton>
          <ActionButton 
            variant="outlined" 
            startIcon={<GroupIcon />}
            component={Link}
            to="/projects"
          >
            Explore Projects
          </ActionButton>
          <ActionButton 
            variant="outlined" 
            startIcon={<ForumIcon />}
            component={Link}
            to="/forums"
          >
            Join Discussions
          </ActionButton>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {/* Left Column - User Profile */}
        <Grid item xs={12} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 3, 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center" sx={{ mb: 2 }}>
              <Avatar 
                src={user?.avatar || 'https://randomuser.me/api/portraits/men/31.jpg'} 
                sx={{ width: 100, height: 100, mb: 2 }}
              />
              <Typography variant="h6" component="h2" align="center">
                {user?.name || 'Alex Smith'}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
                {user?.title || 'Computer Science Student'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                <Typography variant="body2" color="text.secondary">
                  {user?.location || 'San Francisco, CA'}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle2" gutterBottom>
              Top Skills
            </Typography>
            <Box sx={{ mb: 2 }}>
              {(user?.skills || ['JavaScript', 'React', 'Node.js']).slice(0, 5).map((skill, index) => (
                <Chip 
                  key={index}
                  label={skill}
                  size="small"
                  sx={{ mr: 1, mb: 1 }}
                />
              ))}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Button 
              variant="outlined" 
              fullWidth 
              component={Link}
              to="/profile"
            >
              View Full Profile
            </Button>
          </Paper>
          
          {/* User Stats */}
          <Grid container spacing={2}>
            {userStats.map((stat, index) => (
              <Grid item xs={12} key={index}>
                <StatCard>
                  <Box sx={{ mb: 1 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </StatCard>
              </Grid>
            ))}
          </Grid>
        </Grid>
        
        {/* Center Column - Main Content */}
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden'
            }}
          >
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <StyledTab label="Recommended" />
              <StyledTab label="Internships" />
              <StyledTab label="Projects" />
              <StyledTab label="Discussions" />
            </Tabs>
            
            <Box sx={{ p: 3 }}>
              {/* Recommended Tab */}
              {activeTab === 0 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Recommended Internships
                  </Typography>
                  {recommendedInternships.map((internship) => (
                    <Card 
                      key={internship.id} 
                      sx={{ 
                        mb: 3, 
                        '&:hover': { boxShadow: 3 },
                        transition: 'box-shadow 0.3s ease',
                        position: 'relative',
                        overflow: 'visible'
                      }}
                    >
                      <Chip 
                        label={`${internship.matchPercentage}% Match`} 
                        color="primary" 
                        size="small"
                        sx={{ 
                          position: 'absolute', 
                          top: -10, 
                          right: 16,
                          fontWeight: 'bold'
                        }}
                      />
                      <CardHeader
                        avatar={
                          <Avatar src={internship.logo} />
                        }
                        title={internship.title}
                        subheader={
                          <Box>
                            <Typography variant="body2">{internship.company}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                              <LocationIcon fontSize="small" sx={{ mr: 0.5, fontSize: 16 }} />
                              <Typography variant="body2" color="text.secondary">
                                {internship.location}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        action={
                          <IconButton aria-label="settings">
                            <BookmarkIcon />
                          </IconButton>
                        }
                      />
                      <CardContent>
                        <Box sx={{ mb: 2 }}>
                          {internship.skills.map((skill, index) => (
                            <Chip 
                              key={index}
                              label={skill}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Button 
                            variant="contained" 
                            size="small"
                            component={Link}
                            to={`/internships/${internship.id}`}
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="outlined" 
                            size="small"
                            startIcon={<ShareIcon />}
                          >
                            Share
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                    Recommended Projects
                  </Typography>
                  {recommendedProjects.map((project) => (
                    <Card 
                      key={project.id} 
                      sx={{ 
                        mb: 3, 
                        '&:hover': { boxShadow: 3 },
                        transition: 'box-shadow 0.3s ease'
                      }}
                    >
                      <CardHeader
                        avatar={
                          <Avatar src={project.creator.avatar} />
                        }
                        title={project.title}
                        subheader={`Created by ${project.creator.name}`}
                        action={
                          <IconButton aria-label="settings">
                            <MoreVertIcon />
                          </IconButton>
                        }
                      />
                      <CardContent>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {project.description}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                          <Typography variant="body2">
                            <strong>Team Size:</strong> {project.teamSize}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Open Roles:</strong> {project.openRoles.length}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Required Skills:</strong>
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          {project.skills.map((skill, index) => (
                            <Chip 
                              key={index}
                              label={skill}
                              size="small"
                              variant="outlined"
                              sx={{ mr: 1, mb: 1 }}
                            />
                          ))}
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Button 
                            variant="contained" 
                            size="small"
                            component={Link}
                            to={`/projects/${project.id}`}
                          >
                            View Project
                          </Button>
                          <Button 
                            variant="outlined" 
                            size="small"
                            startIcon={<AddIcon />}
                          >
                            Join Team
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}
              
              {/* Internships Tab */}
              {activeTab === 1 && (
                <Box component={Link} to="/internships" sx={{ textDecoration: 'none' }}>
                  <Typography>
                    View all internships on the Internships page
                  </Typography>
                </Box>
              )}
              
              {/* Projects Tab */}
              {activeTab === 2 && (
                <Box component={Link} to="/projects" sx={{ textDecoration: 'none' }}>
                  <Typography>
                    View all projects on the Projects page
                  </Typography>
                </Box>
              )}
              
              {/* Discussions Tab */}
              {activeTab === 3 && (
                <Box component={Link} to="/forums" sx={{ textDecoration: 'none' }}>
                  <Typography>
                    View all discussions on the Forums page
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Right Column - Trending */}
        <Grid item xs={12} md={3}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              mb: 3
            }}
          >
            <Typography variant="h6" gutterBottom>
              Trending Topics
            </Typography>
            <List sx={{ p: 0 }}>
              {trendingTopics.map((topic) => (
                <TrendingItem key={topic.id} alignItems="flex-start" component={Button} disableRipple>
                  <ListItemAvatar>
                    <Avatar src={topic.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={topic.title}
                    secondary={
                      <React.Fragment>
                        <Typography variant="body2" component="span">
                          {topic.author}
                        </Typography>
                        <Box component="span" sx={{ display: 'block', fontSize: '0.75rem', color: 'text.secondary' }}>
                          {topic.time} • {topic.reads} reads
                        </Box>
                      </React.Fragment>
                    }
                  />
                </TrendingItem>
              ))}
            </List>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button 
                component={Link} 
                to="/forums"
                color="primary"
              >
                View More Topics
              </Button>
            </Box>
          </Paper>
          
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Career Resources
            </Typography>
            <List sx={{ p: 0 }}>
              <ListItem 
                component={Link} 
                to="/learning-path"
                sx={{ 
                  color: 'inherit', 
                  textDecoration: 'none',
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemText
                  primary="Personalized Learning Path"
                  secondary="Curated courses tailored to your skills"
                />
              </ListItem>
              <ListItem 
                component={Link} 
                to="/skill-assessment"
                sx={{ 
                  color: 'inherit', 
                  textDecoration: 'none',
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemText
                  primary="Skills Assessment"
                  secondary="Test your knowledge and get feedback"
                />
              </ListItem>
              <ListItem 
                component={Link} 
                to="/career-dashboard"
                sx={{ 
                  color: 'inherit', 
                  textDecoration: 'none',
                  borderRadius: 1,
                  '&:hover': { bgcolor: 'action.hover' }
                }}
              >
                <ListItemText
                  primary="Career Dashboard"
                  secondary="Track your progress and get insights"
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 