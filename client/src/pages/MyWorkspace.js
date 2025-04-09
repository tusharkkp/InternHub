import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Paper,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  Alert
} from '@mui/material';
import {
  Work,
  Code,
  CalendarToday,
  BusinessCenter,
  People,
  Assessment,
  Delete,
  Sort,
  FilterList,
  Refresh as RefreshIcon,
  Task as TaskIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { fetchAppliedInternships, fetchUserProjects, leaveProject, deleteProject } from '../store/slices/workspaceSlice';
import { fetchUserTasks } from '../store/slices/taskSlice';
import TaskManagement from '../components/tasks/TaskManagement';

// Tab Panel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`workspace-tabpanel-${index}`}
      aria-labelledby={`workspace-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MyWorkspace = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  
  const { user } = useSelector(state => state.auth);
  const { 
    appliedInternships,
    userProjects,
    loading: { internships: internshipsLoading, projects: projectsLoading },
    error: { internships: internshipsError, projects: projectsError }
  } = useSelector(state => state.workspace);

  // Add this near the top of the component to track when component renders
  console.log('MyWorkspace component rendering with props:', {
    appliedInternships,
    userProjects,
    loadingState: { internshipsLoading, projectsLoading },
    errorState: { internshipsError, projectsError }
  });

  // Add a new state variable to track if we're using mock data
  const [usingMockData, setUsingMockData] = useState(false);

  // Add new state variables for the detail modals
  const [openInternshipDetailModal, setOpenInternshipDetailModal] = useState(false);
  const [openProjectDetailModal, setOpenProjectDetailModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Add state for delete project dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Status colors for internship applications
  const statusColors = {
    'Applied': 'primary',
    'Under Review': 'info',
    'Accepted': 'success',
    'Rejected': 'error',
    'Withdrawn': 'warning'
  };

  // Project status colors
  const projectStatusColors = {
    'Active': 'success',
    'Completed': 'info',
    'On Hold': 'warning',
    'Planning': 'secondary'
  };

  // Add a refreshData function that can be called any time we need fresh data
  const refreshData = () => {
    console.log('Refreshing workspace data...');
    dispatch(fetchAppliedInternships());
    dispatch(fetchUserProjects());
    dispatch(fetchUserTasks());
  };

  // Update the useEffect to use the refreshData function and also add a refresh interval
  useEffect(() => {
    // Initial data load
    refreshData();
    
    // Set up interval for periodic refreshes (every 30 seconds)
    const refreshInterval = setInterval(() => {
      refreshData();
    }, 30000);
    
    // Clear interval on component unmount
    return () => clearInterval(refreshInterval);
  }, [dispatch]);

  useEffect(() => {
    console.log('Applied Internships:', appliedInternships);
    console.log('User Projects:', userProjects);
    console.log('Loading state:', { internshipsLoading, projectsLoading });
    console.log('Error state:', { internshipsError, projectsError });
  }, [appliedInternships, userProjects, internshipsLoading, projectsLoading, internshipsError, projectsError]);

  // Add useEffect to check for mock data
  useEffect(() => {
    // Check if applied internships contain mock data
    if (appliedInternships && appliedInternships.length > 0) {
      const hasMockInternships = appliedInternships.some(item => item.id === '1' || item.id === '2');
      if (hasMockInternships) {
        setUsingMockData(true);
      }
    }

    // Check if user projects contain mock data
    if (userProjects && userProjects.length > 0) {
      const hasMockProjects = userProjects.some(item => item.id === '1' || item.id === '2');
      if (hasMockProjects) {
        setUsingMockData(true);
      }
    }
  }, [appliedInternships, userProjects]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLeaveProject = (projectId) => {
    setSelectedProjectId(projectId);
    setOpenLeaveDialog(true);
  };

  const confirmLeaveProject = async () => {
    dispatch(leaveProject(selectedProjectId))
      .then(() => {
        setOpenLeaveDialog(false);
        // Success notification could be added here
      })
      .catch((error) => {
        console.error('Failed to leave project:', error);
        // Error notification could be added here
      });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Add handler functions for opening the modals
  const handleViewInternshipDetails = (internship) => {
    setSelectedInternship(internship);
    setOpenInternshipDetailModal(true);
  };

  const navigate = useNavigate();

  // Update to navigate to ProjectDetail page
  const handleViewProjectDetails = (project) => {
    navigate(`/projects/${project.id}`);
  };

  // Add handler for opening delete dialog
  const handleDeleteProject = (project) => {
    setProjectToDelete(project);
    setOpenDeleteDialog(true);
  };

  // Add handler for confirming deletion
  const confirmDeleteProject = () => {
    dispatch(deleteProject(projectToDelete.id))
      .then(() => {
        setOpenDeleteDialog(false);
        // Success notification could be added here
      })
      .catch((error) => {
        console.error('Failed to delete project:', error);
        // Error notification could be added here
      });
  };

  // Show loading state if either data set is loading
  if (internshipsLoading || projectsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          My Workspace
        </Typography>
        
        {/* Show alert if using mock data */}
        {usingMockData && (
          <Alert severity="info" sx={{ mb: 2 }}>
            You're viewing mock data. In production, this will be replaced with your real internship applications and projects.
          </Alert>
        )}
      </Box>

      {/* Workspace Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="workspace tabs"
        >
          <Tab 
            icon={<BusinessCenter />} 
            label="Applied Internships" 
            iconPosition="start"
          />
          <Tab 
            icon={<Code />} 
            label="My Projects" 
            iconPosition="start"
          />
          <Tab 
            icon={<TaskIcon />} 
            label="My Tasks" 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Applied Internships Tab */}
      <TabPanel value={tabValue} index={0}>
        {!appliedInternships || appliedInternships.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <BusinessCenter sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              You haven't applied to any internships yet
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              component={RouterLink}
              to="/internships"
              sx={{ mt: 2 }}
            >
              Browse Internships
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {appliedInternships.map((internship) => (
              <Grid item xs={12} md={6} key={internship.id}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {internship.title}
                      </Typography>
                      <Chip 
                        label={internship.status} 
                        color={statusColors[internship.status] || 'default'} 
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <BusinessCenter sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body1" color="text.secondary">
                        {internship.company}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Applied on {formatDate(internship.applicationDate)}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2 }}>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => handleViewInternshipDetails(internship)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>

      {/* My Projects Tab */}
      <TabPanel value={tabValue} index={1}>
        {!userProjects || userProjects.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Code sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              You haven't joined any projects yet
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              component={RouterLink}
              to="/projects"
              sx={{ mt: 2 }}
            >
              Browse Projects
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {userProjects.map((project) => (
              <Grid item xs={12} md={6} key={project.id}>
                <Card 
                  elevation={2}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  {project.image && (
                    <Box
                      sx={{
                        height: 140,
                        backgroundImage: `url(${project.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {project.title}
                      </Typography>
                      <Chip 
                        label={project.status} 
                        color={projectStatusColors[project.status] || 'default'} 
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {project.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <People sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Team Size: {project.teamSize} members
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                      <Button 
                        variant="outlined" 
                        size="small"
                        component={RouterLink}
                        to={`/projects/${project.id}`}
                        sx={{ mr: 1 }}
                      >
                        View Project
                      </Button>
                      {project.isOwner && (
                        <Button 
                          variant="outlined" 
                          color="secondary"
                          size="small"
                          component={RouterLink}
                          to={`/projects/${project.id}?tab=tasks`}
                          startIcon={<TaskIcon />}
                        >
                          Manage Tasks
                        </Button>
                      )}
                    </Box>
                    <Box>
                      {project.isOwner ? (
                        <Button 
                          variant="outlined" 
                          color="error" 
                          size="small"
                          startIcon={<Delete />}
                          onClick={() => handleDeleteProject(project)}
                          sx={{ ml: 1 }}
                        >
                          Delete Project
                        </Button>
                      ) : (
                        <Button 
                          variant="outlined" 
                          color="error" 
                          size="small"
                          startIcon={<Delete />}
                          onClick={() => handleLeaveProject(project.id)}
                          disabled={project.isOwner}
                          title={project.isOwner ? "Owners cannot leave their own projects" : "Leave this project"}
                        >
                          Leave Project
                        </Button>
                      )}
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </TabPanel>
      
      {/* My Tasks Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Manage Your Tasks Across All Projects
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Track and organize all tasks assigned to you from different projects. Use the different views to manage your work effectively.
        </Typography>
        
        <TaskManagement isPersonalView={true} />
      </TabPanel>

      {/* Confirmation Dialog for Leaving Project */}
      <Dialog
        open={openLeaveDialog}
        onClose={() => setOpenLeaveDialog(false)}
      >
        <DialogTitle>Leave Project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to leave this project? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLeaveDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmLeaveProject} color="error" variant="contained">
            Leave Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Internship Detail Modal */}
      <Dialog
        open={openInternshipDetailModal}
        onClose={() => setOpenInternshipDetailModal(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedInternship && (
          <>
            <DialogTitle>
              {selectedInternship.title}
              <Chip 
                label={selectedInternship.status} 
                color={statusColors[selectedInternship.status] || 'default'} 
                size="small"
                sx={{ ml: 2 }}
              />
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BusinessCenter sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">
                      {selectedInternship.company}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Application Date
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDate(selectedInternship.applicationDate)}
                  </Typography>
                </Grid>
                {selectedInternship.description && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Description
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedInternship.description}
                    </Typography>
                  </Grid>
                )}
                {selectedInternship.deadline && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Application Deadline
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {formatDate(selectedInternship.deadline)}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenInternshipDetailModal(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Project Detail Modal */}
      <Dialog
        open={openProjectDetailModal}
        onClose={() => setOpenProjectDetailModal(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedProject && (
          <>
            <DialogTitle>
              {selectedProject.title}
              <Chip 
                label={selectedProject.status} 
                color={projectStatusColors[selectedProject.status] || 'default'} 
                size="small"
                sx={{ ml: 2 }}
              />
            </DialogTitle>
            <DialogContent dividers>
              {selectedProject.image && (
                <Box
                  sx={{
                    width: '100%',
                    height: 200,
                    backgroundImage: `url(${selectedProject.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: 1,
                    mb: 3
                  }}
                />
              )}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Description
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {selectedProject.description}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Team Size
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <People sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      {selectedProject.teamSize} members
                    </Typography>
                  </Box>
                </Grid>
                {selectedProject.owner && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Project Owner
                    </Typography>
                    <Typography variant="body1">
                      {selectedProject.owner.name}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenProjectDetailModal(false)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Project Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Project?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project? This action cannot be undone and will remove the project for all team members.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteProject} color="error" variant="contained">
            Delete Project
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyWorkspace; 