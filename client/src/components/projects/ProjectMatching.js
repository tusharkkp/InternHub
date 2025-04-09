import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip, 
  Avatar, 
  Stack, 
  CircularProgress,
  LinearProgress,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  Tooltip,
  Link,
  Snackbar,
  Fade,
  styled
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import GroupIcon from '@mui/icons-material/Group';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FaceIcon from '@mui/icons-material/Face';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import SettingsIcon from '@mui/icons-material/Settings';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import DoneIcon from '@mui/icons-material/Done';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Code as CodeIcon,
  TrendingUp as TrendingUpIcon,
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Extension as ExtensionIcon
} from '@mui/icons-material';

// Styled components for enhanced UI
const ProjectCard = styled(Card)(({ theme, matchcolor }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  borderLeft: `4px solid ${matchcolor}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8]
  }
}));

const TeammateCard = styled(Card)(({ theme, matchcolor }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  borderLeft: `4px solid ${matchcolor}`,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8]
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  padding: '8px 16px',
  transition: 'all 0.3s ease',
  fontWeight: 600,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.2)',
  }
}));

const ProjectMatching = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectMatches, setProjectMatches] = useState([]);
  const [teammateSuggestions, setTeammateSuggestions] = useState([]);
  const [joinedProjects, setJoinedProjects] = useState([]);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    type: 'success'
  });
  
  // Mock user skills for recommendation algorithm
  const userSkills = user?.skills || [
    { name: 'React', level: 'Advanced' },
    { name: 'JavaScript', level: 'Expert' },
    { name: 'Node.js', level: 'Intermediate' },
    { name: 'Express', level: 'Intermediate' },
    { name: 'MongoDB', level: 'Beginner' },
    { name: 'UI/UX', level: 'Advanced' }
  ];
  
  // Mock project matches with percentage match based on skills
  const mockProjects = [
    {
      id: '1',
      title: 'AI-Powered Learning Platform',
      description: 'Developing an adaptive learning platform that personalizes content based on student performance and learning patterns.',
      requiredSkills: ['React', 'Node.js', 'Machine Learning', 'MongoDB', 'Express'],
      skillsMatch: 68,
      skillGaps: ['Machine Learning'],
      creator: {
        name: 'Elena Rodriguez',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        title: 'EdTech Specialist'
      },
      teamSize: 4,
      openRoles: ['ML Engineer', 'Backend Developer'],
      duration: '3 months'
    },
    {
      id: '2',
      title: 'SkillSync Mobile App',
      description: 'Creating a cross-platform mobile application for the SkillSync platform with offline capabilities and real-time notifications.',
      requiredSkills: ['React Native', 'JavaScript', 'Firebase', 'Redux', 'UI/UX'],
      skillsMatch: 82,
      skillGaps: ['React Native', 'Firebase'],
      creator: {
        name: 'Marcus Chen',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        title: 'Mobile Developer'
      },
      teamSize: 3,
      openRoles: ['UI/UX Designer', 'React Native Developer'],
      duration: '4 months'
    },
    {
      id: '3',
      title: 'Internship Matching Algorithm',
      description: 'Building an advanced algorithm to match students with internship opportunities based on skills, interests, and company requirements.',
      requiredSkills: ['JavaScript', 'Algorithm Design', 'Data Structures', 'Node.js', 'Express'],
      skillsMatch: 75,
      skillGaps: ['Algorithm Design', 'Data Structures'],
      creator: {
        name: 'Aisha Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        title: 'Senior Software Engineer'
      },
      teamSize: 2,
      openRoles: ['Algorithm Specialist', 'Full Stack Developer'],
      duration: '2 months'
    }
  ];
  
  // Mock teammate suggestions
  const mockTeammates = [
    {
      id: '1',
      name: 'David Kim',
      avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
      title: 'Frontend Developer',
      skills: ['React', 'TypeScript', 'UI/UX', 'Redux', 'Figma'],
      compatibilityScore: 92,
      portfolioProjects: 8,
      previousCollaborations: ['Web Dashboard', 'E-commerce Platform']
    },
    {
      id: '2',
      name: 'Sarah Patel',
      avatar: 'https://randomuser.me/api/portraits/women/22.jpg',
      title: 'Backend Developer',
      skills: ['Node.js', 'Express', 'MongoDB', 'GraphQL', 'Docker'],
      compatibilityScore: 85,
      portfolioProjects: 12,
      previousCollaborations: ['API Gateway', 'Auth Service']
    },
    {
      id: '3',
      name: 'Michael Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/76.jpg',
      title: 'Full Stack Developer',
      skills: ['React', 'Node.js', 'MySQL', 'TypeScript', 'AWS'],
      compatibilityScore: 78,
      portfolioProjects: 6,
      previousCollaborations: ['Customer Portal', 'Analytics Dashboard']
    }
  ];
  
  useEffect(() => {
    // Simulate API call to fetch project matches
    const fetchData = async () => {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setProjectMatches(mockProjects);
      setTeammateSuggestions(mockTeammates);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);
  
  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  const handleRefreshMatches = () => {
    setIsLoading(true);
    
    // Simulate refreshing project matches with slight delay
    setTimeout(() => {
      // Shuffle the order of projects and teammates
      const shuffledProjects = [...mockProjects].sort(() => Math.random() - 0.5);
      const shuffledTeammates = [...mockTeammates].sort(() => Math.random() - 0.5);
      
      setProjectMatches(shuffledProjects);
      setTeammateSuggestions(shuffledTeammates);
      setIsLoading(false);
    }, 1000);
  };

  const handleJoinProject = (projectId) => {
    // Check if already joined
    if (joinedProjects.includes(projectId)) {
      return;
    }

    // Simulate API call to join project
    setTimeout(() => {
      // Update local state
      setJoinedProjects([...joinedProjects, projectId]);
      
      // Show success notification
      setNotification({
        open: true,
        message: 'You have successfully registered.',
        type: 'success'
      });
      
      // Simulate updating backend
      console.log('Project joined:', projectId);
      
      // In a real app, you would dispatch an action to update Redux store
      // dispatch(joinProject({ projectId }));
    }, 800);
  };

  const handleConnect = (teammateId) => {
    // Check if already connected
    if (connectionRequests.includes(teammateId)) {
      return;
    }

    // Simulate API call to send connection request
    setTimeout(() => {
      // Update local state
      setConnectionRequests([...connectionRequests, teammateId]);
      
      // Show success notification
      setNotification({
        open: true,
        message: 'Connection request sent successfully.',
        type: 'success'
      });
      
      // Simulate updating backend
      console.log('Connection request sent to:', teammateId);
      
      // In a real app, you would dispatch an action to update Redux store
      // dispatch(sendConnectionRequest({ teammateId }));
    }, 800);
  };
  
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };
  
  const filteredProjects = projectMatches.filter(project => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.requiredSkills.some(skill => skill.toLowerCase().includes(query))
    );
  });
  
  const getCompatibilityColor = (score) => {
    if (score >= 90) return 'success.main';
    if (score >= 70) return 'primary.main';
    if (score >= 50) return 'warning.main';
    return 'error.main';
  };
  
  const renderSkillsMatch = (match) => {
    const matchColor = match >= 80 ? 'success.main' : match >= 60 ? 'warning.main' : 'error.main';
    
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={match} 
            sx={{ 
              height: 8, 
              borderRadius: 5,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: matchColor
              }
            }} 
          />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${match}%`}</Typography>
        </Box>
      </Box>
    );
  };
  
  const renderSkillGaps = (gaps) => {
    if (gaps.length === 0) return null;
    
    return (
      <Box sx={{ mt: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Skill gaps:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
          {gaps.map((skill, index) => (
            <Chip 
              key={index} 
              label={skill} 
              size="small" 
              color="default"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>
    );
  };
  
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LightbulbIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h5">
            AI Project Matching
          </Typography>
        </Box>
        
        <ActionButton
          startIcon={<AutorenewIcon />}
          variant="outlined"
          onClick={handleRefreshMatches}
          disabled={isLoading}
        >
          Refresh Matches
        </ActionButton>
      </Box>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        Our AI has analyzed your skills and found projects that would be a good match for you. These recommendations are based on your skills, experience, and learning goals.
      </Alert>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search projects by title, description, or skills"
          value={searchQuery}
          onChange={handleSearchInput}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="clear"
                  onClick={handleClearSearch}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="filter"
                >
                  <FilterListIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </Box>
      
      <Typography variant="h6" gutterBottom>
        Recommended Projects
      </Typography>
      
      {isLoading ? (
        <Box sx={{ width: '100%', my: 4 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            Analyzing your skills and finding the best matches...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProjects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <ProjectCard matchcolor={getCompatibilityColor(project.skillsMatch)}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {project.title}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar 
                      src={project.creator.avatar} 
                      alt={project.creator.name}
                      sx={{ width: 24, height: 24, mr: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {project.creator.name}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Team size: {project.teamSize} • Duration: {project.duration}
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    {project.description}
                  </Typography>
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" gutterBottom>
                      Required skills:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {project.requiredSkills.map((skill, index) => (
                        <Chip 
                          key={index}
                          label={skill}
                          size="small"
                          color={userSkills.some(s => s.name === skill) ? "primary" : "default"}
                          variant={userSkills.some(s => s.name === skill) ? "filled" : "outlined"}
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  {renderSkillsMatch(project.skillsMatch)}
                  {renderSkillGaps(project.skillGaps)}
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Open roles:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {project.openRoles.map((role, index) => (
                        <Chip key={index} label={role} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  </Box>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  {joinedProjects.includes(project.id) ? (
                    <ActionButton 
                      size="small" 
                      variant="contained"
                      color="success"
                      startIcon={<CheckCircleIcon />}
                      fullWidth
                      disabled
                    >
                      Registered Successfully
                    </ActionButton>
                  ) : (
                    <ActionButton 
                      size="small" 
                      variant="contained"
                      startIcon={<GroupIcon />}
                      fullWidth
                      onClick={() => handleJoinProject(project.id)}
                      sx={{
                        '&:hover': {
                          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        }
                      }}
                    >
                      Join Project
                    </ActionButton>
                  )}
                </CardActions>
              </ProjectCard>
            </Grid>
          ))}
        </Grid>
      )}
      
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h6" gutterBottom>
        Recommended Teammates
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Based on your skills and project interests, we've found potential teammates who would complement your abilities.
      </Typography>
      
      {isLoading ? (
        <Box sx={{ width: '100%', my: 4 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            Finding compatible teammates...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {teammateSuggestions.map((teammate) => (
            <Grid item xs={12} md={6} lg={4} key={teammate.id}>
              <TeammateCard matchcolor={getCompatibilityColor(teammate.compatibilityScore)}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      src={teammate.avatar} 
                      alt={teammate.name}
                      sx={{ width: 60, height: 60, mr: 2 }}
                    />
                    <Box>
                      <Typography variant="h6">
                        {teammate.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {teammate.title}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Compatibility:
                    </Typography>
                    <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                      <CircularProgress
                        variant="determinate"
                        value={teammate.compatibilityScore}
                        size={35}
                        thickness={5}
                        sx={{ 
                          color: getCompatibilityColor(teammate.compatibilityScore),
                          '& .MuiCircularProgress-circle': {
                            strokeLinecap: 'round',
                          }
                        }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="caption" component="div" fontWeight="bold">
                          {teammate.compatibilityScore}%
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Skills:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {teammate.skills.map((skill, index) => (
                        <Chip 
                          key={index}
                          label={skill}
                          size="small"
                          color={userSkills.some(s => s.name === skill) ? "default" : "primary"}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Portfolio projects: {teammate.portfolioProjects}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Previous collaborations: {teammate.previousCollaborations.length}
                    </Typography>
                  </Box>
                  
                  {connectionRequests.includes(teammate.id) ? (
                    <ActionButton 
                      variant="contained" 
                      color="success"
                      fullWidth 
                      startIcon={<DoneIcon />}
                      disabled
                    >
                      Request Sent
                    </ActionButton>
                  ) : (
                    <ActionButton 
                      variant="outlined"
                      color="primary"
                      fullWidth 
                      startIcon={<PersonAddIcon />}
                      onClick={() => handleConnect(teammate.id)}
                      sx={{
                        '&:hover': {
                          background: 'linear-gradient(45deg, #7E57C2 30%, #9575CD 90%)',
                          color: 'white'
                        }
                      }}
                    >
                      Connect
                    </ActionButton>
                  )}
                </CardContent>
              </TeammateCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Fade}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.type} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ProjectMatching; 