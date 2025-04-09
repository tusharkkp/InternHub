import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Avatar,
  AvatarGroup,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  Code as CodeIcon,
  Task as TaskIcon,
  CheckBox as CheckBoxIcon,
  Description as DescriptionIcon,
  Group as GroupIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import TaskManagement from '../tasks/TaskManagement';
import TodoList from './TodoList';
import { 
  fetchProjectById, 
  updateProject,
  deleteProject,
  joinProject,
  leaveProject 
} from '../../store/slices/projectSlice';

// TabPanel component for tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`project-tabpanel-${index}`}
      aria-labelledby={`project-tab-${index}`}
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

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Get tab from URL query parameter
  const getInitialTab = () => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    
    // Map tab parameter to tab index
    if (tabParam === 'tasks') return 1;
    if (tabParam === 'todo') return 2;
    if (tabParam === 'repository') return 3;
    if (tabParam === 'team') return 4;
    
    // Default to Overview tab
    return 0;
  };
  
  // Redux state
  const { project, loading, error } = useSelector(state => state.projects);
  const { user } = useSelector(state => state.auth);
  
  // Local state
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [editMode, setEditMode] = useState(false);
  const [editedProject, setEditedProject] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Check if the current user is the project owner
  const isOwner = project && project.isOwner === true;
  
  // Debug project data
  useEffect(() => {
    console.log('Project data loaded:', project);
    console.log('Current user:', user);
    console.log('Is owner:', isOwner);
  }, [project, user, isOwner]);
  
  // Fetch project data
  useEffect(() => {
    console.log('Fetching project data for ID:', id);
    dispatch(fetchProjectById(id));
  }, [dispatch, id]);
  
  // Set the edited project when project data is loaded
  useEffect(() => {
    if (project) {
      setEditedProject({
        title: project.title,
        description: project.description,
        requiredSkills: project.requiredSkills || [],
        maxTeamSize: project.maxTeamSize || 5,
        status: project.status || 'Looking for team members'
      });
    }
  }, [project]);
  
  // Check if the current user is a member (but not the owner)
  const isMember = project && user && project.members && 
    project.members.some(member => member.id === user.id);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    
    // Update URL with tab parameter
    const tabNames = ['overview', 'tasks', 'todo', 'repository', 'team'];
    navigate(`/projects/${id}?tab=${tabNames[newValue]}`, { replace: true });
  };
  
  // Handle joining project
  const handleJoinProject = () => {
    dispatch(joinProject(id)).then(() => {
      setSnackbar({
        open: true,
        message: 'Successfully joined the project',
        severity: 'success'
      });
    });
  };
  
  // Handle leaving project
  const handleLeaveProject = () => {
    dispatch(leaveProject(id)).then(() => {
      setLeaveDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'You have left the project',
        severity: 'info'
      });
    });
  };
  
  // Handle toggling edit mode
  const handleToggleEditMode = () => {
    setEditMode(!editMode);
  };
  
  // Handle saving project edits
  const handleSaveEdits = () => {
    dispatch(updateProject({ projectId: id, projectData: editedProject })).then(() => {
      setEditMode(false);
      setSnackbar({
        open: true,
        message: 'Project updated successfully',
        severity: 'success'
      });
    });
  };
  
  // Handle project deletion
  const handleDeleteProject = () => {
    dispatch(deleteProject(id)).then(() => {
      navigate('/projects');
      setSnackbar({
        open: true,
        message: 'Project deleted successfully',
        severity: 'info'
      });
    });
  };
  
  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  // Handle toggling favorite status
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    setSnackbar({
      open: true,
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      severity: 'success'
    });
  };
  
  // Edit field change handler
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedProject(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/projects')}
          sx={{ mt: 2 }}
        >
          Back to Projects
        </Button>
      </Box>
    );
  }
  
  if (!project) {
    return (
      <Box sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">Project not found</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/projects')}
          sx={{ mt: 2 }}
        >
          Back to Projects
        </Button>
      </Box>
    );
  }
  
  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Back button and project actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/projects')}
            >
              Back to Projects
            </Button>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                color={isFavorite ? 'primary' : 'default'}
                onClick={handleToggleFavorite}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
              
              <IconButton
                color="primary"
                aria-label="Share project"
              >
                <ShareIcon />
              </IconButton>
              
              {isOwner && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={editMode ? null : <EditIcon />}
                    onClick={handleToggleEditMode}
                    color={editMode ? 'secondary' : 'primary'}
                  >
                    {editMode ? 'Cancel' : 'Edit'}
                  </Button>
                  
                  {editMode && (
                    <Button
                      variant="contained"
                      onClick={handleSaveEdits}
                      color="primary"
                    >
                      Save
                    </Button>
                  )}
                  
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete
                  </Button>
                </>
              )}
              
              {isMember && !isOwner && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setLeaveDialogOpen(true)}
                >
                  Leave Project
                </Button>
              )}
              
              {!isOwner && !isMember && (
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={handleJoinProject}
                >
                  Join Project
                </Button>
              )}
            </Box>
          </Box>
          
          {/* Project header */}
          <Paper
            elevation={3}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 2,
              background: theme.palette.mode === 'dark' 
                ? `linear-gradient(to right, ${theme.palette.primary.dark}, ${theme.palette.background.paper})` 
                : `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.background.paper})`
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                {editMode ? (
                  <TextField
                    fullWidth
                    label="Project Title"
                    name="title"
                    value={editedProject.title}
                    onChange={handleEditChange}
                    sx={{ mb: 2 }}
                  />
                ) : (
                  <Typography variant="h4" component="h1" gutterBottom>
                    {project.title}
                  </Typography>
                )}
                
                {/* Project status */}
                <Box sx={{ mb: 3 }}>
                  <Chip 
                    label={project.status} 
                    color={
                      project.status === 'Completed' ? 'success' : 
                      project.status === 'In Progress' ? 'primary' : 
                      'secondary'
                    }
                    sx={{ mr: 1 }}
                  />
                  
                  <Chip 
                    label={`Team Size: ${project.members ? project.members.length + 1 : 1}/${project.maxTeamSize || 5}`}
                    variant="outlined"
                  />
                </Box>
                
                {/* Project description */}
                {editMode ? (
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Project Description"
                    name="description"
                    value={editedProject.description}
                    onChange={handleEditChange}
                  />
                ) : (
                  <Typography variant="body1" paragraph>
                    {project.description}
                  </Typography>
                )}
                
                {/* Required skills */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Required Skills:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {(project.requiredSkills || []).map((skill, index) => (
                      <Chip 
                        key={index} 
                        label={skill} 
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                {/* Project team */}
                <Typography variant="subtitle1" gutterBottom>
                  Project Team:
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      src={project.owner?.avatar}
                      alt={project.owner?.name}
                      sx={{ mr: 1 }}
                    />
                    <Box>
                      <Typography variant="body1">
                        {project.owner?.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Project Owner
                      </Typography>
                    </Box>
                  </Box>
                  
                  {(project.members || []).length > 0 && (
                    <>
                      <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                        Team Members:
                      </Typography>
                      <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
                        {project.members.map((member) => (
                          <Avatar
                            key={member.id}
                            src={member.avatar}
                            alt={member.name}
                            title={member.name}
                          />
                        ))}
                      </AvatarGroup>
                    </>
                  )}
                </Box>
                
                {/* Project creation date */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Created on: {formatDate(project.createdAt)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Project tabs */}
          <Paper sx={{ mb: 4, borderRadius: 2, overflow: 'hidden' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : false}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab 
                icon={<DescriptionIcon />} 
                label="Overview" 
                iconPosition="start"
                sx={{ py: 2 }}
              />
              <Tab 
                icon={<TaskIcon />} 
                label="Tasks" 
                iconPosition="start"
                sx={{ py: 2 }}
              />
              <Tab 
                icon={<CheckBoxIcon />} 
                label="To-Do" 
                iconPosition="start"
                sx={{ py: 2 }}
              />
              <Tab 
                icon={<CodeIcon />} 
                label="Repository" 
                iconPosition="start"
                sx={{ py: 2 }}
              />
              <Tab 
                icon={<GroupIcon />} 
                label="Team" 
                iconPosition="start"
                sx={{ py: 2 }}
              />
            </Tabs>
            
            {/* Overview tab */}
            <TabPanel value={activeTab} index={0}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Project Overview
                </Typography>
                <Typography variant="body1" paragraph>
                  {project.description}
                </Typography>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom>
                  Project Goals
                </Typography>
                <Typography variant="body1" paragraph>
                  This section would include project goals and milestones.
                </Typography>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom>
                  Project Timeline
                </Typography>
                <Typography variant="body1">
                  This section would include a project timeline or Gantt chart.
                </Typography>
              </Box>
            </TabPanel>
            
            {/* Tasks tab */}
            <TabPanel value={activeTab} index={1}>
              <TaskManagement 
                projectId={id} 
                isOwner={isOwner} 
                projectMembers={project?.members}
                isPersonalView={false}
              />
            </TabPanel>
            
            {/* To-Do tab */}
            <TabPanel value={activeTab} index={2}>
              <Typography variant="h6" gutterBottom>
                Personal Notes & References
              </Typography>
              <Typography variant="body1" paragraph>
                This space is for your personal notes, links, and references related to this project.
              </Typography>
              <TodoList projectId={id} />
            </TabPanel>
            
            {/* Repository tab */}
            <TabPanel value={activeTab} index={3}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Project Repository
                </Typography>
                <Typography variant="body1">
                  This section would include repository information and code management tools.
                </Typography>
                
                {/* Placeholder for repository integration */}
                <Alert severity="info" sx={{ mt: 3 }}>
                  Repository integration is coming soon. You'll be able to connect GitHub, GitLab, or Bitbucket repositories.
                </Alert>
              </Box>
            </TabPanel>
            
            {/* Team tab */}
            <TabPanel value={activeTab} index={4}>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Project Team
                </Typography>
                
                <Grid container spacing={3}>
                  {/* Project owner */}
                  <Grid item xs={12} md={4}>
                    <Paper
                      elevation={2}
                      sx={{ p: 3, borderRadius: 2, height: '100%' }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          src={project.owner?.avatar}
                          alt={project.owner?.name}
                          sx={{ width: 64, height: 64, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="h6">
                            {project.owner?.name}
                          </Typography>
                          <Chip 
                            label="Project Owner" 
                            color="primary"
                            size="small"
                          />
                        </Box>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        Skills:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {(project.owner?.skills || []).map((skill, index) => (
                          <Chip 
                            key={index} 
                            label={skill} 
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Paper>
                  </Grid>
                  
                  {/* Team members */}
                  {(project.members || []).map((member) => (
                    <Grid item xs={12} md={4} key={member.id}>
                      <Paper
                        elevation={2}
                        sx={{ p: 3, borderRadius: 2, height: '100%' }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar
                            src={member.avatar}
                            alt={member.name}
                            sx={{ width: 64, height: 64, mr: 2 }}
                          />
                          <Box>
                            <Typography variant="h6">
                              {member.name}
                            </Typography>
                            <Chip 
                              label="Team Member" 
                              color="secondary"
                              size="small"
                            />
                          </Box>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" color="text.secondary">
                          Skills:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                          {(member.skills || []).map((skill, index) => (
                            <Chip 
                              key={index} 
                              label={skill} 
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                  
                  {/* Empty team slots */}
                  {Array.from({ length: project.maxTeamSize - (project.members || []).length - 1 }, (_, index) => (
                    <Grid item xs={12} md={4} key={`empty-${index}`}>
                      <Paper
                        elevation={2}
                        sx={{ 
                          p: 3, 
                          borderRadius: 2, 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px dashed',
                          borderColor: 'divider'
                        }}
                      >
                        <PersonAddIcon 
                          color="action" 
                          sx={{ fontSize: 48, opacity: 0.5, mb: 2 }} 
                        />
                        <Typography variant="body1" color="text.secondary" align="center">
                          Open Position
                        </Typography>
                        <Button
                          variant="outlined"
                          startIcon={<PersonAddIcon />}
                          sx={{ mt: 2 }}
                          disabled={isOwner || isMember}
                          onClick={!isOwner && !isMember ? handleJoinProject : undefined}
                        >
                          {isOwner ? 'Invite Member' : isMember ? 'Joined' : 'Join Team'}
                        </Button>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </TabPanel>
          </Paper>
        </motion.div>
      </Container>
      
      {/* Delete project dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteProject} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Leave project dialog */}
      <Dialog
        open={leaveDialogOpen}
        onClose={() => setLeaveDialogOpen(false)}
      >
        <DialogTitle>Leave Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to leave this project?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLeaveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleLeaveProject} color="primary" autoFocus>
            Leave
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectDetail; 