import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Button, 
  Chip, 
  Grid, 
  Link, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
  FormHelperText
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkIcon from '@mui/icons-material/Link';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import CodeIcon from '@mui/icons-material/Code';

const Portfolio = () => {
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isImportGithubOpen, setIsImportGithubOpen] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  
  // New state for form fields
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    completionDate: '',
    image: 'https://via.placeholder.com/300x150?text=New+Project'
  });
  
  // Mock portfolio projects
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: 'E-commerce Platform',
      description: 'A full-stack e-commerce application with React, Node.js, and MongoDB',
      image: 'https://via.placeholder.com/300x150?text=E-commerce+Project',
      tags: ['React', 'Node.js', 'MongoDB', 'Express'],
      githubUrl: 'https://github.com/username/ecommerce',
      liveUrl: 'https://ecommerce-demo.example.com',
      completionDate: '2023-05-15'
    },
    {
      id: 2,
      title: 'Weather Dashboard',
      description: 'A weather application that displays real-time weather data using a third-party API',
      image: 'https://via.placeholder.com/300x150?text=Weather+App',
      tags: ['JavaScript', 'HTML/CSS', 'API Integration'],
      githubUrl: 'https://github.com/username/weather-app',
      liveUrl: 'https://weather-app-demo.example.com',
      completionDate: '2023-02-20'
    },
    {
      id: 3,
      title: 'Task Management System',
      description: 'A Kanban-style task management application with drag-and-drop functionality',
      image: 'https://via.placeholder.com/300x150?text=Task+Manager',
      tags: ['React', 'Redux', 'Firebase'],
      githubUrl: 'https://github.com/username/task-manager',
      liveUrl: 'https://task-manager-demo.example.com',
      completionDate: '2023-08-10'
    }
  ]);
  
  const handleAddProject = () => {
    setIsAddProjectOpen(true);
  };
  
  const handleImportGithub = () => {
    setIsImportGithubOpen(true);
  };
  
  const handleCloseAddProject = () => {
    setIsAddProjectOpen(false);
    // Reset form fields
    setNewProject({
      title: '',
      description: '',
      technologies: '',
      githubUrl: '',
      liveUrl: '',
      completionDate: '',
      image: 'https://via.placeholder.com/300x150?text=New+Project'
    });
    // Clear validation errors
    setValidationErrors({});
  };
  
  const handleCloseImportGithub = () => {
    setIsImportGithubOpen(false);
  };
  
  // Handle input changes for new project form
  const handleNewProjectChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Submit new project
  const handleSubmitNewProject = () => {
    // Validate required fields
    const errors = {};
    if (!newProject.title) errors.title = 'Title is required';
    if (!newProject.description) errors.description = 'Description is required';
    if (!newProject.technologies) errors.technologies = 'At least one technology is required';
    
    // If there are errors, show them and don't submit
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // Clear any previous validation errors
    setValidationErrors({});
    
    // Create new project object
    const projectToAdd = {
      id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
      title: newProject.title,
      description: newProject.description,
      tags: newProject.technologies.split(',').map(tech => tech.trim()),
      githubUrl: newProject.githubUrl,
      liveUrl: newProject.liveUrl,
      completionDate: newProject.completionDate || new Date().toISOString().split('T')[0],
      image: newProject.image
    };
    
    // Add to projects array
    setProjects([...projects, projectToAdd]);
    
    // Show success notification
    setShowSuccess(true);
    
    // Close dialog and reset form
    handleCloseAddProject();
  };
  
  const handleImportGithubSubmit = () => {
    if (!githubUsername) return;
    
    setIsLoading(true);
    
    // Simulate API call to fetch GitHub repositories
    setTimeout(() => {
      // Mock GitHub repositories data
      const newProjects = [
        {
          id: 4,
          title: 'Algorithmic Trading Bot',
          description: 'A Python-based trading bot that uses machine learning to make trading decisions',
          image: 'https://via.placeholder.com/300x150?text=Trading+Bot',
          tags: ['Python', 'Machine Learning', 'API Integration'],
          githubUrl: `https://github.com/${githubUsername}/trading-bot`,
          liveUrl: '',
          completionDate: '2023-09-05'
        },
        {
          id: 5,
          title: 'Portfolio Website',
          description: 'A personal portfolio website built with React and Tailwind CSS',
          image: 'https://via.placeholder.com/300x150?text=Portfolio',
          tags: ['React', 'Tailwind CSS', 'Responsive Design'],
          githubUrl: `https://github.com/${githubUsername}/portfolio`,
          liveUrl: 'https://portfolio-demo.example.com',
          completionDate: '2023-07-12'
        }
      ];
      
      // Add GitHub projects to existing projects
      setProjects([...projects, ...newProjects]);
      setIsLoading(false);
      setIsImportGithubOpen(false);
      setGithubUsername('');
    }, 2000);
  };
  
  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };
  
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Portfolio
        </Typography>
        <Box>
          <Button 
            startIcon={<GitHubIcon />} 
            variant="outlined" 
            size="small" 
            onClick={handleImportGithub}
            sx={{ mr: 1 }}
            className="btn btn-outline"
          >
            Import from GitHub
          </Button>
          <Button 
            startIcon={<AddIcon />} 
            variant="contained" 
            size="small"
            onClick={handleAddProject}
            className="btn btn-primary"
          >
            Add Project
          </Button>
        </Box>
      </Box>
      
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card className="card card-project" sx={{ display: 'flex', flexDirection: 'column' }}>
              {project.image ? (
                <CardMedia
                  component="img"
                  height="140"
                  image={project.image}
                  alt={project.title}
                  className="card-img"
                />
              ) : (
                <Box 
                  sx={{ 
                    height: 140, 
                    bgcolor: 'primary.light', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}
                >
                  <FolderIcon sx={{ fontSize: 60, color: 'white' }} />
                </Box>
              )}
              <CardContent className="card-body">
                <Typography variant="h6" component="div" gutterBottom>
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {project.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                  {project.tags.map((tag, index) => (
                    <Chip key={index} label={tag} size="small" className="chip chip-skill" />
                  ))}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Completed: {new Date(project.completionDate).toLocaleDateString()}
                </Typography>
              </CardContent>
              <CardActions className="card-footer">
                {project.githubUrl && (
                  <IconButton 
                    aria-label="GitHub Repository" 
                    component={Link} 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    size="small"
                  >
                    <GitHubIcon />
                  </IconButton>
                )}
                {project.liveUrl && (
                  <IconButton 
                    aria-label="Live Demo" 
                    component={Link} 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    size="small"
                  >
                    <LinkIcon />
                  </IconButton>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Add Project Dialog */}
      <Dialog open={isAddProjectOpen} onClose={handleCloseAddProject} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Project Title"
              margin="normal"
              required
              value={newProject.title}
              onChange={handleNewProjectChange}
              name="title"
              error={!!validationErrors.title}
              helperText={validationErrors.title || ''}
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={3}
              required
              value={newProject.description}
              onChange={handleNewProjectChange}
              name="description"
              error={!!validationErrors.description}
              helperText={validationErrors.description || ''}
            />
            <TextField
              fullWidth
              label="Technologies Used (comma separated)"
              margin="normal"
              required
              value={newProject.technologies}
              onChange={handleNewProjectChange}
              name="technologies"
              error={!!validationErrors.technologies}
              helperText={validationErrors.technologies || 'Example: React, Node.js, MongoDB'}
            />
            <TextField
              fullWidth
              label="GitHub URL"
              margin="normal"
              value={newProject.githubUrl}
              onChange={handleNewProjectChange}
              name="githubUrl"
              placeholder="https://github.com/username/repo"
            />
            <TextField
              fullWidth
              label="Live Demo URL"
              margin="normal"
              value={newProject.liveUrl}
              onChange={handleNewProjectChange}
              name="liveUrl"
            />
            <TextField
              fullWidth
              label="Completion Date"
              type="date"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              value={newProject.completionDate}
              onChange={handleNewProjectChange}
              name="completionDate"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddProject} className="btn btn-outline">Cancel</Button>
          <Button variant="contained" onClick={handleSubmitNewProject} className="btn btn-primary">Add Project</Button>
        </DialogActions>
      </Dialog>
      
      {/* Import from GitHub Dialog */}
      <Dialog open={isImportGithubOpen} onClose={handleCloseImportGithub} maxWidth="sm" fullWidth>
        <DialogTitle>Import Projects from GitHub</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="GitHub Username"
              margin="normal"
              required
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              disabled={isLoading}
              InputProps={{
                startAdornment: <GitHubIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This will import your public repositories from GitHub and add them to your portfolio.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportGithub} disabled={isLoading} className="btn btn-outline">Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleImportGithubSubmit}
            disabled={!githubUsername || isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <CodeIcon />}
            className="btn btn-primary"
          >
            {isLoading ? 'Importing...' : 'Import Repositories'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Notification */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Project added successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Portfolio; 