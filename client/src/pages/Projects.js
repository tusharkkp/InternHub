import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Chip, 
  Box, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Tabs,
  Tab,
  Paper,
  CircularProgress,
  Avatar,
  Link,
  LinearProgress,
  Tooltip,
  Stack
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { addProject, joinProject, updateProjectSlots } from '../store/slices/projectSlice';
import ProjectMatching from '../components/projects/ProjectMatching';
import { 
  Apps as AppsIcon, 
  Handshake as HandshakeIcon,
  Group as GroupIcon,
  GroupAdd as GroupAddIcon,
  Info as InfoIcon,
  Check as CheckIcon
} from '@mui/icons-material';

const MOCK_PROJECTS = [
  {
    id: '1',
    title: 'AI Chat Application',
    description: 'Build a modern AI-powered chat application using React and Node.js.',
    status: 'Looking for team members',
    requiredSkills: ['React', 'Node.js', 'AI'],
    createdBy: { id: '1', name: 'John Doe' },
    team: [],
    maxTeamSize: 5,
    availableSlots: 5,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '2',
    title: 'E-commerce Platform',
    description: 'Develop a full-stack e-commerce platform with product management, shopping cart, and payment integration.',
    status: 'In progress',
    requiredSkills: ['React', 'MongoDB', 'Express', 'Node.js', 'Payment API'],
    createdBy: { id: '2', name: 'Jane Smith' },
    team: [{ id: '3', name: 'Bob Johnson' }],
    maxTeamSize: 4,
    availableSlots: 3,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: '3',
    title: 'Mobile Fitness App',
    description: 'Create a fitness tracking application with social features, workout planning, and progress visualization.',
    status: 'Looking for team members',
    requiredSkills: ['React Native', 'Firebase', 'UI/UX', 'Redux'],
    createdBy: { id: '4', name: 'Emma Wilson' },
    team: [],
    maxTeamSize: 4,
    availableSlots: 4,
    createdAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: '4',
    title: 'Blockchain Marketplace',
    description: 'Develop a decentralized marketplace using blockchain technology for secure transactions and digital asset trading.',
    status: 'Looking for team members',
    requiredSkills: ['Blockchain', 'Solidity', 'Web3.js', 'React'],
    createdBy: { id: '5', name: 'Alex Johnson' },
    team: [{ id: '6', name: 'Lisa Chen' }, { id: '7', name: 'Michael Brown' }],
    maxTeamSize: 5,
    availableSlots: 3,
    createdAt: new Date(Date.now() - 345600000).toISOString()
  }
];

const AVAILABLE_SKILLS = [
  'React', 'Angular', 'Vue', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL',
  'Python', 'Django', 'Flask', 'Java', 'Spring', 'C#', '.NET', 'PHP',
  'Laravel', 'Ruby', 'Rails', 'Swift', 'Kotlin', 'Flutter', 'React Native',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'DevOps', 'CI/CD',
  'Machine Learning', 'AI', 'Data Science', 'Blockchain', 'GraphQL', 'REST API'
];

const Projects = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { projects } = useSelector(state => state.projects);
  
  const [activeTab, setActiveTab] = useState(0);
  const [projectsList, setProjectsList] = useState(projects.length > 0 ? projects : MOCK_PROJECTS);
  const [newProjectDialog, setNewProjectDialog] = useState(false);
  const [projectDetailsDialog, setProjectDetailsDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    requiredSkills: [],
    status: 'Looking for team members',
    maxTeamSize: 5
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [selectedProjectForJoin, setSelectedProjectForJoin] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleNewProject = () => {
    setNewProject({
      title: '',
      description: '',
      requiredSkills: [],
      status: 'Looking for team members',
      maxTeamSize: 5
    });
    setNewProjectDialog(true);
  };

  const handleCloseNewProject = () => {
    setNewProjectDialog(false);
  };

  const handleCreateProject = () => {
    if (!newProject.title || !newProject.description) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    const project = {
      id: (projectsList.length + 1).toString(),
      ...newProject,
      createdBy: { id: user?.id || '1', name: user?.name || 'Anonymous' },
      team: [],
      availableSlots: newProject.maxTeamSize,
      createdAt: new Date().toISOString()
    };

    dispatch(addProject(project));
    setProjectsList([...projectsList, project]);
    setNewProjectDialog(false);
    setSnackbar({
      open: true,
      message: 'Project created successfully!',
      severity: 'success'
    });
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setProjectDetailsDialog(true);
  };

  const handleCloseDetails = () => {
    setProjectDetailsDialog(false);
  };

  const handleJoinTeam = async (project) => {
    // Check authentication
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please log in to join a project',
        severity: 'warning'
      });
      return;
    }

    // Check if there are available slots
    if (project.availableSlots <= 0) {
      setSnackbar({
        open: true,
        message: 'This project is already full',
        severity: 'warning'
      });
      return;
    }

    // Set loading state
    setLoading(true);
    setSelectedProjectForJoin(project.id);

    // Create user object from auth data
    const currentUser = { 
      id: user?.id || '1', 
      name: user?.name || 'Current User',
      avatar: user?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'
    };
    
    // Check if user is already in the team
    if (project.team.some(member => member.id === currentUser.id)) {
      setSnackbar({
        open: true,
        message: 'You are already part of this project',
        severity: 'info'
      });
      setLoading(false);
      setSelectedProjectForJoin(null);
      return;
    }

    try {
      // Simulate API call to join project
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Calculate new available slots
      const newAvailableSlots = project.availableSlots - 1;
      
      // Use Redux actions to update state
      dispatch(joinProject({
        projectId: project.id,
        user: currentUser
      }));

      // Update local state for immediate UI feedback
      const updatedProjects = projectsList.map(p => 
        p.id === project.id 
          ? { 
              ...p, 
              team: [...p.team, currentUser],
              availableSlots: newAvailableSlots,
              status: newAvailableSlots <= 0 ? 'Team full' : p.status
            } 
          : p
      );
      setProjectsList(updatedProjects);
      
      // If details dialog is open, update the selected project
      if (projectDetailsDialog && selectedProject?.id === project.id) {
        setSelectedProject({
          ...selectedProject,
          team: [...selectedProject.team, currentUser],
          availableSlots: newAvailableSlots,
          status: newAvailableSlots <= 0 ? 'Team full' : selectedProject.status
        });
      }

      // Show success message
      setSnackbar({
        open: true,
        message: 'You have successfully joined the project!',
        severity: 'success'
      });
    } catch (error) {
      // Handle error
      console.error('Error joining project:', error);
      setSnackbar({
        open: true,
        message: 'Failed to join project. Please try again later.',
        severity: 'error'
      });
    } finally {
      // Reset loading state
      setLoading(false);
      setSelectedProjectForJoin(null);
    }
  };

  const handleShareProject = (project) => {
    navigator.clipboard.writeText(`Check out this project: ${project.title}`);
    setSnackbar({
      open: true,
      message: 'Project link copied to clipboard!',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleInputChange = (e) => {
    setNewProject({
      ...newProject,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderProjectsList = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, mb: 4 }}>
        <Typography variant="h5" component="h2">
          Available Projects
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleNewProject}
        >
          Create Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projectsList.map((project) => (
          <Grid item key={project.id} xs={12} md={6} lg={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              borderRadius: 2,
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
              }
            }}>
              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">
                    {project.title}
                  </Typography>
                  <Chip 
                    label={project.status} 
                    color={
                      project.status === 'Looking for team members' ? 'primary' : 
                      project.status === 'In progress' ? 'success' : 
                      project.status === 'Team full' ? 'error' :
                      'default'
                    } 
                    size="small" 
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    src={project.createdBy.avatar || `https://randomuser.me/api/portraits/lego/1.jpg`}
                    alt={project.createdBy.name}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  />
                  Created by {project.createdBy.name} · {formatDate(project.createdAt)}
                </Typography>
                
                <Typography variant="body2" paragraph sx={{ 
                  mb: 2, 
                  height: '4.5em', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  display: '-webkit-box', 
                  WebkitLineClamp: 3, 
                  WebkitBoxOrient: 'vertical' 
                }}>
                  {project.description}
                </Typography>
                
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  Required Skills:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
                  {project.requiredSkills.map((skill, index) => (
                    <Chip key={index} label={skill} size="small" variant="outlined" color="primary" />
                  ))}
                </Box>
                
                {/* Team size and available slots */}
                <Box sx={{ mt: 2, mb: 1, p: 1.5, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <GroupIcon fontSize="small" color="primary" />
                    <Typography variant="body2" fontWeight="medium">
                      {project.team.length} / {project.maxTeamSize} Team Members
                    </Typography>
                    <Tooltip title="Available slots left to join this project">
                      <InfoIcon fontSize="small" color="action" sx={{ ml: 'auto' }} />
                    </Tooltip>
                  </Stack>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={(project.team.length / project.maxTeamSize) * 100} 
                        color={project.availableSlots === 0 ? "error" : project.availableSlots === 1 ? "warning" : "primary"}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    color={project.availableSlots === 0 ? "error.main" : project.availableSlots === 1 ? "warning.main" : "primary.main"}
                    sx={{ mt: 0.5, textAlign: 'center' }}
                  >
                    {project.availableSlots === 0 
                      ? "No slots available" 
                      : `${project.availableSlots} ${project.availableSlots === 1 ? 'slot' : 'slots'} available`}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions sx={{ pt: 0, px: 2, pb: 2, justifyContent: 'space-between' }}>
                <Button 
                  size="small" 
                  onClick={() => handleViewDetails(project)}
                  variant="outlined"
                >
                  View Details
                </Button>
                
                <Box>
                  {project.availableSlots <= 0 ? (
                    <Button 
                      size="small" 
                      disabled
                      color="error"
                      variant="outlined"
                      startIcon={<GroupIcon />}
                    >
                      Team Full
                    </Button>
                  ) : project.team.some(member => member.id === (user?.id || '1')) ? (
                    <Button 
                      size="small"
                      color="success"
                      variant="contained"
                      startIcon={<CheckIcon />}
                    >
                      Member ✓
                    </Button>
                  ) : (
                    <Button 
                      size="small"
                      variant="contained" 
                      color="primary"
                      onClick={() => handleJoinTeam(project)}
                      disabled={loading}
                      startIcon={selectedProjectForJoin === project.id ? <CircularProgress size={16} /> : <GroupAddIcon />}
                    >
                      {selectedProjectForJoin === project.id ? 'Joining...' : 'Join Team'}
                    </Button>
                  )}
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Project Collaboration Hub
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Find projects to collaborate on, or create your own project and find team members with complementary skills.
        </Typography>
        
        <Paper sx={{ borderRadius: 2, mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab 
              icon={<AppsIcon />} 
              iconPosition="start" 
              label="Browse Projects" 
            />
            <Tab 
              icon={<HandshakeIcon />} 
              iconPosition="start" 
              label="AI Matching" 
            />
          </Tabs>
        </Paper>
        
        {activeTab === 0 ? (
          renderProjectsList()
        ) : (
          <ProjectMatching />
        )}
      </Box>

      {/* New Project Dialog */}
      <Dialog open={newProjectDialog} onClose={handleCloseNewProject} maxWidth="md" fullWidth>
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">Create New Project</Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the details below to create a new project and find team members
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" noValidate sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Project Title"
              name="title"
              value={newProject.title}
              onChange={handleInputChange}
              helperText="Give your project a clear, descriptive title"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Project Description"
              name="description"
              multiline
              rows={4}
              value={newProject.description}
              onChange={handleInputChange}
              helperText="Describe your project, its goals, and what you're looking to accomplish"
            />
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="status-label">Project Status</InputLabel>
                  <Select
                    labelId="status-label"
                    id="status"
                    name="status"
                    value={newProject.status}
                    label="Project Status"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Looking for team members">Looking for team members</MenuItem>
                    <MenuItem value="In progress">In progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, ml: 1.5 }}>
                    Current status of your project
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="maxTeamSize"
                  label="Maximum Team Size"
                  name="maxTeamSize"
                  type="number"
                  InputProps={{ inputProps: { min: 1, max: 20 } }}
                  value={newProject.maxTeamSize}
                  onChange={(e) => setNewProject({
                    ...newProject,
                    maxTeamSize: parseInt(e.target.value, 10) || 5
                  })}
                  helperText={`Set the maximum number of members allowed (1-20)`}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="body2" gutterBottom>
                Team Size Preview:
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                <GroupIcon fontSize="small" color="primary" />
                <Typography variant="body2" fontWeight="medium">
                  0 / {newProject.maxTeamSize} Members
                </Typography>
              </Stack>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={0} 
                    color="primary"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60, textAlign: 'right' }}>
                  {newProject.maxTeamSize} slots available
                </Typography>
              </Box>
            </Box>
            
            <Autocomplete
              multiple
              id="requiredSkills"
              options={AVAILABLE_SKILLS}
              value={newProject.requiredSkills}
              onChange={(event, newValue) => {
                setNewProject({
                  ...newProject,
                  requiredSkills: newValue
                });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Required Skills"
                  margin="normal"
                  helperText="Select the skills required for your project (at least one recommended)"
                />
              )}
              ChipProps={{ size: 'small' }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
          <Button onClick={handleCloseNewProject} variant="outlined">Cancel</Button>
          <Button 
            onClick={handleCreateProject} 
            variant="contained" 
            color="primary"
            disabled={!newProject.title || !newProject.description || newProject.requiredSkills.length === 0}
          >
            Create Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Project Details Dialog */}
      <Dialog open={projectDetailsDialog} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        {selectedProject && (
          <>
            <DialogTitle>
              <Typography variant="h5" component="div" fontWeight="bold">
                {selectedProject.title}
              </Typography>
              <Chip 
                label={selectedProject.status} 
                color={
                  selectedProject.status === 'Looking for team members' ? 'primary' : 
                  selectedProject.status === 'In progress' ? 'success' : 
                  selectedProject.status === 'Team full' ? 'error' :
                  'default'
                } 
                size="small" 
                sx={{ mt: 1 }}
              />
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>About this Project</Typography>
                  <Typography variant="body1" paragraph>
                    {selectedProject.description}
                  </Typography>
                  
                  <Typography variant="h6" gutterBottom>
                    Required Skills
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 3 }}>
                    {selectedProject.requiredSkills.map((skill, index) => (
                      <Chip 
                        key={index} 
                        label={skill} 
                        color="primary" 
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 2, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Project Details</Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                        Created by:
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedProject.createdBy.name}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ width: 120 }}>
                        Date Created:
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(selectedProject.createdAt)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 1.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Team Composition:
                      </Typography>
                      
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <GroupIcon fontSize="small" color="primary" />
                        <Typography variant="body1" fontWeight="medium">
                          {selectedProject.team.length} / {selectedProject.maxTeamSize} Members
                        </Typography>
                      </Stack>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={(selectedProject.team.length / selectedProject.maxTeamSize) * 100} 
                            color={selectedProject.availableSlots === 0 ? "error" : selectedProject.availableSlots === 1 ? "warning" : "primary"}
                            sx={{ height: 10, borderRadius: 5 }}
                          />
                        </Box>
                      </Box>
                      
                      <Typography 
                        variant="body2" 
                        fontWeight="bold"
                        color={selectedProject.availableSlots === 0 ? "error.main" : selectedProject.availableSlots === 1 ? "warning.main" : "primary.main"}
                        sx={{ mt: 0.5, textAlign: 'center' }}
                      >
                        {selectedProject.availableSlots === 0 
                          ? "No slots available" 
                          : `${selectedProject.availableSlots} ${selectedProject.availableSlots === 1 ? 'slot' : 'slots'} available`}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Team Members
                </Typography>
                {selectedProject.team.length > 0 ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    {selectedProject.team.map((member, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          p: 1.5, 
                          borderRadius: 2,
                          backgroundColor: 'rgba(0, 0, 0, 0.03)',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.06)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
                        <Avatar 
                          src={member.avatar || `https://randomuser.me/api/portraits/lego/${index + 1}.jpg`} 
                          alt={member.name}
                          sx={{ width: 48, height: 48, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {member.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {member.role || 'Team Member'}
                          </Typography>
                        </Box>
                        {member.id === (user?.id || '1') && (
                          <Chip
                            label="You"
                            size="small"
                            color="primary"
                            sx={{ ml: 'auto' }}
                          />
                        )}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ p: 3, textAlign: 'center', bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
                    <GroupAddIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                    <Typography variant="body1">No team members yet. Be the first to join!</Typography>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
              <Button onClick={handleCloseDetails} variant="outlined">Close</Button>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => handleShareProject(selectedProject)}
                  startIcon={<InfoIcon />}
                >
                  Share
                </Button>
                
                {selectedProject.availableSlots <= 0 ? (
                  <Button 
                    variant="contained" 
                    disabled
                    color="error"
                    startIcon={<GroupIcon />}
                  >
                    Team Full
                  </Button>
                ) : selectedProject.team.some(member => member.id === (user?.id || '1')) ? (
                  <Button 
                    variant="contained"
                    color="success"
                    startIcon={<CheckIcon />}
                  >
                    Member ✓
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => {
                      handleJoinTeam(selectedProject);
                    }}
                    disabled={loading}
                    startIcon={loading && selectedProjectForJoin === selectedProject.id ? <CircularProgress size={20} /> : <GroupAddIcon />}
                    sx={{ minWidth: 150 }}
                  >
                    {loading && selectedProjectForJoin === selectedProject.id ? 'Joining...' : 'Join Team'}
                  </Button>
                )}
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Projects; 