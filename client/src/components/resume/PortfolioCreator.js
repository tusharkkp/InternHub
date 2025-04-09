import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Tabs, 
  Tab, 
  TextField,
  MenuItem,
  Slider,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Chip,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  IconButton,
  Tooltip,
  Divider,
  Avatar
} from '@mui/material';
import { useSelector } from 'react-redux';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import CodeIcon from '@mui/icons-material/Code';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import LanguageIcon from '@mui/icons-material/Language';
import EditIcon from '@mui/icons-material/Edit';

import resumeService from '../../services/resumeService';

const TEMPLATES = [
  { id: 'professional', name: 'Professional', color: '#1976d2' },
  { id: 'creative', name: 'Creative', color: '#9c27b0' },
  { id: 'minimal', name: 'Minimal', color: '#616161' },
  { id: 'developer', name: 'Developer', color: '#00796b' }
];

const COLOR_SCHEMES = [
  { id: 'blue', primary: '#1976d2', secondary: '#bbdefb' },
  { id: 'purple', primary: '#9c27b0', secondary: '#e1bee7' },
  { id: 'green', primary: '#2e7d32', secondary: '#c8e6c9' },
  { id: 'orange', primary: '#ed6c02', secondary: '#ffe0b2' },
  { id: 'teal', primary: '#00796b', secondary: '#b2dfdb' },
  { id: 'red', primary: '#d32f2f', secondary: '#ffcdd2' },
  { id: 'grey', primary: '#424242', secondary: '#e0e0e0' },
  { id: 'indigo', primary: '#3f51b5', secondary: '#c5cae9' }
];

const PortfolioCreator = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const previewRef = useRef(null);
  
  // Portfolio configuration
  const [portfolioConfig, setPortfolioConfig] = useState({
    template: 'professional',
    colorScheme: 'blue',
    font: 'Roboto',
    showAvatar: true,
    sections: {
      about: true,
      skills: true,
      experience: true,
      education: true,
      projects: true,
      testimonials: false,
      contact: true
    },
    customDomain: '',
    customCss: '',
    customJs: ''
  });
  
  // Define newSkill state for adding skills
  const [newSkill, setNewSkill] = useState('');
  
  // User profile data to be used in the portfolio
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    title: 'Full Stack Web Developer',
    bio: 'I\'m a passionate Full Stack Developer with expertise in modern web technologies. With a strong foundation in both frontend and backend development, I create scalable and user-friendly applications.',
    location: 'San Francisco, CA',
    email: 'alex.johnson@example.com',
    phone: '(555) 123-4567',
    website: 'https://alexjohnson.dev',
    social: {
      linkedin: 'https://linkedin.com/in/alexjohnson',
      github: 'https://github.com/alexjohnson',
      twitter: 'https://twitter.com/alexjohnson'
    },
    skills: [
      'JavaScript', 'React', 'Node.js', 'MongoDB', 'HTML/CSS', 
      'TypeScript', 'GraphQL', 'Git'
    ],
    experience: [
      {
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        startDate: 'Jan 2022',
        endDate: 'Present',
        description: 'Developed modern web applications using React and TypeScript.'
      },
      {
        title: 'Full Stack Developer',
        company: 'WebSolutions LLC',
        location: 'Remote',
        startDate: 'Mar 2020',
        endDate: 'Dec 2021',
        description: 'Built full-stack applications with React, Node.js, and MongoDB.'
      }
    ],
    education: [
      {
        school: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2016',
        endDate: '2020'
      }
    ],
    projects: [
      { 
        title: 'E-commerce Platform', 
        description: 'A full-stack e-commerce application with React, Node.js, and MongoDB',
        image: 'https://via.placeholder.com/300x150?text=E-commerce',
        link: 'https://github.com/alexjohnson/ecommerce'
      },
      { 
        title: 'Task Management App', 
        description: 'A Kanban-style task management app with drag and drop functionality',
        image: 'https://via.placeholder.com/300x150?text=Task+App',
        link: 'https://github.com/alexjohnson/taskapp'
      }
    ]
  });
  
  // State for profile editor
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfileData, setEditedProfileData] = useState({...profileData});
  
  // Initialize with user data if available
  useEffect(() => {
    if (user) {
      // This would be populated with real user data in a production environment
      console.log('User data loaded for portfolio');
    }
  }, [user]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle template change
  const handleTemplateChange = (templateId) => {
    setPortfolioConfig(prev => ({
      ...prev,
      template: templateId
    }));
    
    // Force refresh the preview
    if (previewRef.current) {
      updatePreview();
    }
  };
  
  // Handle color scheme change
  const handleColorSchemeChange = (schemeId) => {
    setPortfolioConfig(prev => ({
      ...prev,
      colorScheme: schemeId
    }));
  };
  
  // Handle font change
  const handleFontChange = (event) => {
    setPortfolioConfig(prev => ({
      ...prev,
      font: event.target.value
    }));
  };
  
  // Handle section visibility toggle
  const handleSectionToggle = (section) => {
    setPortfolioConfig(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: !prev.sections[section]
      }
    }));
  };
  
  // Handle avatar visibility toggle
  const handleAvatarToggle = () => {
    setPortfolioConfig(prev => ({
      ...prev,
      showAvatar: !prev.showAvatar
    }));
  };
  
  // Handle custom domain change
  const handleCustomDomainChange = (event) => {
    setPortfolioConfig(prev => ({
      ...prev,
      customDomain: event.target.value
    }));
  };
  
  // Handle custom CSS change
  const handleCustomCssChange = (event) => {
    setPortfolioConfig(prev => ({
      ...prev,
      customCss: event.target.value
    }));
  };
  
  // Handle custom JS change
  const handleCustomJsChange = (event) => {
    setPortfolioConfig(prev => ({
      ...prev,
      customJs: event.target.value
    }));
  };
  
  // Generate portfolio
  const generatePortfolio = async () => {
    setIsLoading(true);
    
    try {
      // Use the mock function instead of the real API call since we don't have a backend
      const response = await resumeService.mockPublishPortfolio({
        userId: user?.id,
        config: portfolioConfig,
        profileData: profileData
      });
      
      if (response.success) {
        setIsPublished(true);
        setPublishedUrl(response.url);
        
        setSnackbar({
          open: true,
          message: 'Portfolio published successfully!',
          severity: 'success'
        });
        
        // Open the generated portfolio in a new tab
        window.open(response.url, '_blank');
      }
    } catch (error) {
      console.error('Error generating portfolio:', error);
      
      setSnackbar({
        open: true,
        message: 'Error generating portfolio. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Share portfolio
  const sharePortfolio = () => {
    // First check if the Web Share API is available
    if (navigator.share && publishedUrl) {
      navigator.share({
        title: `${profileData.name}'s Portfolio`,
        text: 'Check out my professional portfolio',
        url: publishedUrl,
      })
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Portfolio shared successfully!',
          severity: 'success'
        });
      })
      .catch(error => {
        console.error('Error sharing portfolio:', error);
        // Fallback to copy if sharing fails
        copyPortfolioUrl();
      });
    } else if (publishedUrl) {
      // Fallback for browsers that don't support the Share API
      copyPortfolioUrl();
    } else {
      // If no URL is published yet, generate it first
      setSnackbar({
        open: true,
        message: 'Please generate your portfolio first',
        severity: 'info'
      });
    }
  };
  
  // Copy portfolio URL to clipboard
  const copyPortfolioUrl = () => {
    navigator.clipboard.writeText(publishedUrl).then(
      () => {
        setSnackbar({
          open: true,
          message: 'Portfolio URL copied to clipboard!',
          severity: 'success'
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };
  
  // Get current color scheme
  const getCurrentColorScheme = () => {
    return COLOR_SCHEMES.find(scheme => scheme.id === portfolioConfig.colorScheme) || COLOR_SCHEMES[0];
  };
  
  // Update preview when configurations change
  useEffect(() => {
    updatePreview();
    
    // Apply the selected font to the preview
    if (previewRef.current && portfolioConfig.font) {
      previewRef.current.style.fontFamily = portfolioConfig.font;
    }
  }, [portfolioConfig, profileData, isEditingProfile]);
  
  // Function to update preview with more visual feedback
  const updatePreview = () => {
    if (previewRef.current) {
      const preview = previewRef.current;
      
      // More pronounced visual feedback
      preview.style.opacity = '0.4';
      preview.style.transition = 'opacity 0.3s ease';
      
      // Force layout recalculation
      setTimeout(() => {
        // Apply template-specific styles
        applyTemplateStyles(preview);
        
        // Restore visibility
        preview.style.opacity = '1';
      }, 300);
    }
  };
  
  // Apply template-specific styles to the preview
  const applyTemplateStyles = (previewElement) => {
    const currentTemplate = portfolioConfig.template;
    const currentColors = COLOR_SCHEMES.find(c => c.id === portfolioConfig.colorScheme);
    
    // Get all headings in the preview
    const headings = previewElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    // Apply template-specific styles
    switch (currentTemplate) {
      case 'professional':
        // Professional template: clean, structured
        previewElement.style.fontFamily = portfolioConfig.font;
        headings.forEach(heading => {
          heading.style.borderBottom = heading.tagName === 'H1' ? 'none' : `2px solid ${currentColors?.secondary || '#bbdefb'}`;
          heading.style.paddingBottom = '8px';
          heading.style.fontWeight = '600';
        });
        break;
        
      case 'creative':
        // Creative template: more dynamic, colorful
        previewElement.style.fontFamily = portfolioConfig.font;
        headings.forEach(heading => {
          heading.style.borderBottom = 'none';
          heading.style.background = `linear-gradient(90deg, ${currentColors?.primary || '#9c27b0'} 0%, transparent 100%)`;
          heading.style.paddingLeft = '10px';
          heading.style.paddingRight = '10px';
          heading.style.borderRadius = '4px';
          heading.style.fontWeight = '600';
        });
        break;
        
      case 'minimal':
        // Minimal template: clean, no borders
        previewElement.style.fontFamily = portfolioConfig.font;
        headings.forEach(heading => {
          heading.style.borderBottom = 'none';
          heading.style.fontWeight = '500';
          heading.style.letterSpacing = '0.5px';
        });
        break;
        
      case 'developer':
        // Developer template: code-like
        previewElement.style.fontFamily = "'Source Code Pro', monospace, " + portfolioConfig.font;
        headings.forEach(heading => {
          heading.style.borderBottom = 'none';
          heading.style.fontFamily = "'Source Code Pro', monospace, " + portfolioConfig.font;
          heading.style.fontWeight = '700';
          heading.style.paddingLeft = '10px';
          heading.style.borderLeft = `4px solid ${currentColors?.primary || '#00796b'}`;
        });
        break;
        
      default:
        // Default styles
        previewElement.style.fontFamily = portfolioConfig.font;
        headings.forEach(heading => {
          heading.style.borderBottom = heading.tagName === 'H1' ? 'none' : `2px solid ${currentColors?.secondary || '#bbdefb'}`;
          heading.style.paddingBottom = '8px';
        });
    }
  };
  
  // Toggle profile editing
  const toggleProfileEdit = () => {
    if (isEditingProfile) {
      // Save changes
      setProfileData({...editedProfileData});
      setIsEditingProfile(false);
    } else {
      // Start editing with current data
      setEditedProfileData({...profileData});
      setIsEditingProfile(true);
    }
  };
  
  // Handle profile data changes
  const handleProfileChange = (field, value) => {
    setEditedProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle nested object changes (like social links)
  const handleNestedProfileChange = (parent, field, value) => {
    setEditedProfileData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };
  
  // Handle array changes (like skills)
  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...editedProfileData[field]];
    updatedArray[index] = value;
    
    setEditedProfileData(prev => ({
      ...prev,
      [field]: updatedArray
    }));
  };
  
  // Add item to array (like adding a skill)
  const handleAddArrayItem = (field, value) => {
    setEditedProfileData(prev => ({
      ...prev,
      [field]: [...prev[field], value]
    }));
  };
  
  // Remove item from array (like removing a skill)
  const handleRemoveArrayItem = (field, index) => {
    const updatedArray = [...editedProfileData[field]];
    updatedArray.splice(index, 1);
    
    setEditedProfileData(prev => ({
      ...prev,
      [field]: updatedArray
    }));
  };
  
  // Render appearance tab
  const renderAppearanceTab = () => {
    const currentColorScheme = getCurrentColorScheme();
    
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Template</Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {TEMPLATES.map(template => (
            <Grid item xs={6} sm={3} key={template.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  border: portfolioConfig.template === template.id ? 
                    `2px solid ${template.color}` : '1px solid #e0e0e0',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: 3
                  }
                }}
                onClick={() => handleTemplateChange(template.id)}
              >
                <Box 
                  sx={{ 
                    height: 100, 
                    bgcolor: template.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center' 
                  }}
                >
                  <DesignServicesIcon sx={{ color: 'white', fontSize: 40 }} />
                </Box>
                <CardContent sx={{ py: 1, textAlign: 'center' }}>
                  <Typography variant="body1">{template.name}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Typography variant="h6" gutterBottom>Color Scheme</Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {COLOR_SCHEMES.map(scheme => (
            <Grid item key={scheme.id}>
              <Tooltip title={scheme.id.charAt(0).toUpperCase() + scheme.id.slice(1)}>
                <Box
                  onClick={() => handleColorSchemeChange(scheme.id)}
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${scheme.primary} 50%, ${scheme.secondary} 50%)`,
                    cursor: 'pointer',
                    border: portfolioConfig.colorScheme === scheme.id ?
                      '2px solid #000' : '2px solid transparent',
                    '&:hover': {
                      opacity: 0.9,
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                />
              </Tooltip>
            </Grid>
          ))}
        </Grid>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>Font</Typography>
            <TextField
              select
              fullWidth
              value={portfolioConfig.font}
              onChange={handleFontChange}
              variant="outlined"
            >
              <MenuItem value="Roboto">Roboto</MenuItem>
              <MenuItem value="Open Sans">Open Sans</MenuItem>
              <MenuItem value="Lato">Lato</MenuItem>
              <MenuItem value="Montserrat">Montserrat</MenuItem>
              <MenuItem value="Source Sans Pro">Source Sans Pro</MenuItem>
              <MenuItem value="Raleway">Raleway</MenuItem>
              <MenuItem value="Playfair Display">Playfair Display</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>Avatar</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={portfolioConfig.showAvatar}
                  onChange={handleAvatarToggle}
                  color="primary"
                />
              }
              label="Show profile picture"
            />
          </Grid>
        </Grid>
      </Box>
    );
  };
  
  // Render content tab
  const renderContentTab = () => (
    <Box>
      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Profile Data
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This information will be used to generate your portfolio.
        </Typography>
        
        {isEditingProfile ? (
          // Profile editing form
          <Box component="form" sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={editedProfileData.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Title"
                  value={editedProfileData.title}
                  onChange={(e) => handleProfileChange('title', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Bio"
                  value={editedProfileData.bio}
                  onChange={(e) => handleProfileChange('bio', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={editedProfileData.location}
                  onChange={(e) => handleProfileChange('location', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={editedProfileData.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={editedProfileData.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Website"
                  value={editedProfileData.website}
                  onChange={(e) => handleProfileChange('website', e.target.value)}
                />
              </Grid>
              
              {/* Social Links */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Social Links
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="LinkedIn"
                  value={editedProfileData.social.linkedin}
                  onChange={(e) => handleNestedProfileChange('social', 'linkedin', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="GitHub"
                  value={editedProfileData.social.github}
                  onChange={(e) => handleNestedProfileChange('social', 'github', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Twitter"
                  value={editedProfileData.social.twitter}
                  onChange={(e) => handleNestedProfileChange('social', 'twitter', e.target.value)}
                />
              </Grid>
              
              {/* Skills */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 2 }}>
                  {editedProfileData.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => handleRemoveArrayItem('skills', index)}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextField
                    label="Add Skill"
                    size="small"
                    sx={{ mr: 1 }}
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (newSkill.trim()) {
                          handleAddArrayItem('skills', newSkill.trim());
                          setNewSkill('');
                        }
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => {
                      if (newSkill.trim()) {
                        handleAddArrayItem('skills', newSkill.trim());
                        setNewSkill('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsEditingProfile(false)} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button variant="contained" onClick={toggleProfileEdit}>
                Save Changes
              </Button>
            </Box>
          </Box>
        ) : (
          // Profile display
          <Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {profileData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profileData.title}
              </Typography>
            </Box>
            
            <Button 
              variant="outlined" 
              color="primary"
              onClick={toggleProfileEdit}
              startIcon={<EditIcon />}
            >
              Edit Profile Data
            </Button>
          </Box>
        )}
      </Paper>
      
      <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Sections
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Choose which sections to display in your portfolio.
        </Typography>
        
        <Grid container spacing={2}>
          {Object.keys(portfolioConfig.sections).map((section) => (
            <Grid item xs={12} sm={6} md={4} key={section}>
              <FormControlLabel
                control={
                  <Switch
                    checked={portfolioConfig.sections[section]}
                    onChange={() => handleSectionToggle(section)}
                    color="primary"
                  />
                }
                label={section.charAt(0).toUpperCase() + section.slice(1)}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
  
  // Render advanced tab
  const renderAdvancedTab = () => {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Custom Domain</Typography>
        <TextField
          fullWidth
          placeholder="yourdomain.com"
          value={portfolioConfig.customDomain}
          onChange={handleCustomDomainChange}
          helperText="Leave blank to use our default domain"
          variant="outlined"
          sx={{ mb: 3 }}
        />
        
        <Typography variant="h6" gutterBottom>Custom CSS</Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder=".portfolio-header { background-color: #f5f5f5; }"
          value={portfolioConfig.customCss}
          onChange={handleCustomCssChange}
          variant="outlined"
          sx={{ mb: 3, fontFamily: 'monospace' }}
        />
        
        <Typography variant="h6" gutterBottom>Custom JavaScript</Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="document.addEventListener('DOMContentLoaded', function() { /* Your code here */ });"
          value={portfolioConfig.customJs}
          onChange={handleCustomJsChange}
          variant="outlined"
          sx={{ fontFamily: 'monospace' }}
        />
      </Box>
    );
  };
  
  // Render portfolio preview
  const renderPortfolioPreview = () => {
    const currentTemplate = TEMPLATES.find(t => t.id === portfolioConfig.template);
    const currentColors = COLOR_SCHEMES.find(c => c.id === portfolioConfig.colorScheme);
    
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 0, 
          overflow: 'hidden', 
          borderRadius: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ 
          p: 2, 
          backgroundColor: currentColors?.primary || '#1976d2', 
          color: 'white'
        }}>
          <Typography variant="h6" component="div">
            Preview - {currentTemplate?.name || 'Professional'} Template
          </Typography>
        </Box>
        
        <Box 
          ref={previewRef}
          sx={{ 
            p: 0, 
            flexGrow: 1,
            height: 'calc(100vh - 250px)',
            overflow: 'auto',
            border: '1px solid #eee',
            transition: 'all 0.5s ease',
            fontFamily: portfolioConfig.font
          }}
        >
          {/* Preview Header */}
          <Box sx={{ 
            backgroundColor: currentColors?.primary || '#1976d2',
            color: 'white',
            p: 4,
            textAlign: portfolioConfig.template === 'developer' ? 'left' : 'center',
            backgroundImage: portfolioConfig.template === 'creative' ? 
              `linear-gradient(135deg, ${currentColors?.primary} 0%, ${adjustColor(currentColors?.primary, 30)} 100%)` : 
              'none'
          }}>
            {portfolioConfig.showAvatar && (
              <Avatar 
                src="https://randomuser.me/api/portraits/men/41.jpg"
                alt="Profile"
                sx={{ 
                  width: 150, 
                  height: 150, 
                  mx: portfolioConfig.template === 'developer' ? '0' : 'auto', 
                  mb: 2,
                  border: '4px solid white',
                  boxShadow: portfolioConfig.template === 'creative' ? '0 0 20px rgba(0,0,0,0.3)' : 'none'
                }}
              />
            )}
            <Typography variant="h4" component="h1" gutterBottom sx={{
              fontWeight: portfolioConfig.template === 'minimal' ? '300' : '600',
              letterSpacing: portfolioConfig.template === 'creative' ? '1px' : 'normal',
              textTransform: portfolioConfig.template === 'minimal' ? 'uppercase' : 'none',
              fontSize: portfolioConfig.template === 'developer' ? '2.5rem' : '2.125rem'
            }}>
              {profileData.name}
            </Typography>
            <Typography variant="h6" gutterBottom sx={{
              opacity: portfolioConfig.template === 'minimal' ? '0.8' : '1',
              fontStyle: portfolioConfig.template === 'creative' ? 'italic' : 'normal',
              fontWeight: portfolioConfig.template === 'minimal' ? '300' : '400',
              letterSpacing: portfolioConfig.template === 'minimal' ? '0.5px' : 'normal'
            }}>
              {profileData.title}
            </Typography>
            <Typography variant="body1" sx={{
              maxWidth: portfolioConfig.template === 'minimal' ? '600px' : '800px',
              margin: portfolioConfig.template === 'developer' ? '0' : '0 auto',
              fontStyle: portfolioConfig.template === 'creative' ? 'italic' : 'normal',
              fontWeight: portfolioConfig.template === 'minimal' ? '300' : '400'
            }}>
              {profileData.bio.length > (portfolioConfig.template === 'minimal' ? 100 : 150) ? 
                `${profileData.bio.substring(0, portfolioConfig.template === 'minimal' ? 100 : 150)}...` : 
                profileData.bio}
            </Typography>
            
            <Box sx={{ 
              mt: 2, 
              display: 'flex', 
              justifyContent: portfolioConfig.template === 'developer' ? 'flex-start' : 'center' 
            }}>
              <IconButton color="inherit" sx={{ mx: 1 }}>
                <LinkedInIcon />
              </IconButton>
              <IconButton color="inherit" sx={{ mx: 1 }}>
                <GitHubIcon />
              </IconButton>
              <IconButton color="inherit" sx={{ mx: 1 }}>
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" sx={{ mx: 1 }}>
                <LanguageIcon />
              </IconButton>
            </Box>
          </Box>
          
          {/* Preview Content - renders differently based on selected template */}
          <Box sx={{ 
            p: 4,
            bgcolor: portfolioConfig.template === 'creative' ? '#f9f9f9' : 'background.paper'
          }}>
            {/* About Section */}
            {portfolioConfig.sections.about && (
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  gutterBottom
                  sx={{ 
                    color: currentColors?.primary || '#1976d2',
                    borderBottom: portfolioConfig.template === 'minimal' ? 'none' : `2px solid ${currentColors?.secondary || '#bbdefb'}`,
                    pb: 1,
                    display: 'inline-block',
                    position: 'relative',
                    '&:after': portfolioConfig.template === 'creative' ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '50%',
                      height: '2px',
                      backgroundColor: currentColors?.primary || '#9c27b0'
                    } : {}
                  }}
                >
                  About Me
                </Typography>
                <Typography variant="body1" paragraph sx={{
                  fontSize: portfolioConfig.template === 'minimal' ? '1rem' : '1.1rem',
                  lineHeight: portfolioConfig.template === 'developer' ? '1.7' : '1.5',
                  textAlign: portfolioConfig.template === 'minimal' ? 'justify' : 'left'
                }}>
                  {profileData.bio}
                </Typography>
              </Box>
            )}
            
            {/* Skills Section */}
            {portfolioConfig.sections.skills && (
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  gutterBottom
                  sx={{ 
                    color: currentColors?.primary || '#1976d2',
                    borderBottom: portfolioConfig.template === 'minimal' ? 'none' : `2px solid ${currentColors?.secondary || '#bbdefb'}`,
                    pb: 1,
                    display: 'inline-block',
                    position: 'relative',
                    '&:after': portfolioConfig.template === 'creative' ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '50%',
                      height: '2px',
                      backgroundColor: currentColors?.primary || '#9c27b0'
                    } : {}
                  }}
                >
                  Skills
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  mt: portfolioConfig.template === 'developer' ? 2 : 1
                }}>
                  {profileData.skills.map((skill, index) => (
                    <Chip 
                      key={index}
                      label={skill}
                      sx={{ 
                        bgcolor: getChipBackground(portfolioConfig.template, currentColors, index),
                        color: getChipColor(portfolioConfig.template, currentColors),
                        fontWeight: getChipFontWeight(portfolioConfig.template),
                        borderRadius: portfolioConfig.template === 'developer' ? '4px' : '16px',
                        border: portfolioConfig.template === 'minimal' ? `1px solid ${currentColors?.primary || '#616161'}` : 'none',
                        padding: portfolioConfig.template === 'developer' ? '0 4px' : '0',
                        fontFamily: portfolioConfig.template === 'developer' ? 
                          "'Source Code Pro', monospace" : portfolioConfig.font
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            
            {/* Projects Section */}
            {portfolioConfig.sections.projects && (
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  gutterBottom
                  sx={{ 
                    color: currentColors?.primary || '#1976d2',
                    borderBottom: portfolioConfig.template === 'minimal' ? 'none' : `2px solid ${currentColors?.secondary || '#bbdefb'}`,
                    pb: 1,
                    display: 'inline-block',
                    position: 'relative',
                    '&:after': portfolioConfig.template === 'creative' ? {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '50%',
                      height: '2px',
                      backgroundColor: currentColors?.primary || '#9c27b0'
                    } : {}
                  }}
                >
                  Projects
                </Typography>
                <Grid container spacing={3} sx={{ mt: portfolioConfig.template === 'developer' ? 2 : 0 }}>
                  {profileData.projects.map((project, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card 
                        elevation={getCardElevation(portfolioConfig.template)}
                        sx={{
                          border: getBorderStyle(portfolioConfig.template, currentColors),
                          overflow: 'hidden',
                          borderRadius: getBorderRadius(portfolioConfig.template),
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          '&:hover': getCardHoverStyle(portfolioConfig.template)
                        }}
                      >
                        <CardMedia
                          component="img"
                          height={portfolioConfig.template === 'minimal' ? '120' : '140'}
                          image={project.image}
                          alt={project.title}
                        />
                        <CardContent>
                          <Typography 
                            variant="h6" 
                            component="div" 
                            gutterBottom
                            sx={{
                              fontWeight: portfolioConfig.template === 'developer' ? '700' : '600',
                              fontFamily: portfolioConfig.template === 'developer' ? 
                                "'Source Code Pro', monospace" : portfolioConfig.font,
                              color: portfolioConfig.template === 'creative' ? 
                                currentColors?.primary || '#9c27b0' : 'inherit'
                            }}
                          >
                            {project.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              fontFamily: portfolioConfig.font,
                              fontSize: portfolioConfig.template === 'developer' ? '0.9rem' : '0.875rem'
                            }}
                          >
                            {project.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {/* More sections would be added based on configuration */}
          </Box>
        </Box>
      </Paper>
    );
  };
  
  // Helper functions for template-specific styling
  
  // Adjust color brightness
  const adjustColor = (color, amount) => {
    if (!color) return '#1976d2';
    
    return color;  // Simplified for implementation
  };
  
  // Get chip background color based on template
  const getChipBackground = (template, colors, index) => {
    switch (template) {
      case 'developer':
        return 'rgba(0,0,0,0.08)';
      case 'creative':
        // Alternate colors for creative template
        return index % 2 === 0 ? colors?.secondary || '#e1bee7' : colors?.primary || '#9c27b0';
      case 'minimal':
        return 'transparent';
      default:
        return colors?.secondary || '#bbdefb';
    }
  };
  
  // Get chip text color
  const getChipColor = (template, colors) => {
    switch (template) {
      case 'developer':
        return 'text.primary';
      case 'creative':
        return 'white';
      case 'minimal':
        return colors?.primary || '#616161';
      default:
        return colors?.primary || '#1976d2';
    }
  };
  
  // Get chip font weight
  const getChipFontWeight = (template) => {
    switch (template) {
      case 'developer':
        return '500';
      case 'creative':
        return '600';
      case 'minimal':
        return '400';
      default:
        return 'medium';
    }
  };
  
  // Get card elevation based on template
  const getCardElevation = (template) => {
    switch (template) {
      case 'minimal':
        return 0;
      case 'creative':
        return 2;
      case 'developer':
        return 1;
      default:
        return 1;
    }
  };
  
  // Get card border style
  const getBorderStyle = (template, colors) => {
    switch (template) {
      case 'minimal':
        return `1px solid ${colors?.secondary || '#e0e0e0'}`;
      case 'developer':
        return `1px solid #e0e0e0`;
      default:
        return 'none';
    }
  };
  
  // Get card border radius
  const getBorderRadius = (template) => {
    switch (template) {
      case 'minimal':
        return '0px';
      case 'creative':
        return '12px';
      case 'developer':
        return '4px';
      default:
        return '4px';
    }
  };
  
  // Get card hover style
  const getCardHoverStyle = (template) => {
    switch (template) {
      case 'creative':
        return {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
        };
      case 'minimal':
        return {
          borderColor: '#bdbdbd'
        };
      default:
        return {};
    }
  };
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Portfolio Creator
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Create a personalized portfolio to showcase your skills and projects.
          Your portfolio will be automatically generated from your profile data.
        </Typography>
      </Grid>
      
      <Grid item xs={12} md={5} lg={4}>
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab icon={<ColorLensIcon />} label="Appearance" />
            <Tab icon={<VisibilityIcon />} label="Content" />
            <Tab icon={<CodeIcon />} label="Advanced" />
          </Tabs>
          <Box sx={{ height: 450, overflow: 'auto' }}>
            {activeTab === 0 && renderAppearanceTab()}
            {activeTab === 1 && renderContentTab()}
            {activeTab === 2 && renderAdvancedTab()}
          </Box>
        </Paper>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant="contained" 
            color="primary" 
            disabled={isLoading}
            onClick={generatePortfolio}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : undefined}
          >
            {isLoading ? 'Generating...' : isPublished ? 'Update Portfolio' : 'Generate Portfolio'}
          </Button>
          
          {isPublished && (
            <Box>
              <Tooltip title="Share Portfolio">
                <IconButton color="primary" onClick={sharePortfolio} sx={{ ml: 1 }}>
                  <ShareIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Copy URL">
                <IconButton color="primary" onClick={copyPortfolioUrl} sx={{ ml: 1 }}>
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
        
        {isPublished && (
          <Paper sx={{ mt: 2, p: 2, bgcolor: 'success.light' }}>
            <Typography variant="body2" sx={{ color: 'success.contrastText' }}>
              Your portfolio is available at:
            </Typography>
            <Box 
              sx={{ 
                bgcolor: 'background.paper', 
                p: 1, 
                mt: 1, 
                borderRadius: 1, 
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                wordBreak: 'break-all'
              }}
            >
              {publishedUrl}
            </Box>
          </Paper>
        )}
      </Grid>
      
      <Grid item xs={12} md={7} lg={8}>
        <Paper sx={{ height: 600, overflow: 'hidden' }}>
          <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1">Portfolio Preview</Typography>
            <Typography variant="caption" color="text.secondary">
              {portfolioConfig.template} template • {portfolioConfig.colorScheme} colors
            </Typography>
          </Box>
          <Box sx={{ height: 'calc(100% - 40px)', overflow: 'auto' }}>
            {renderPortfolioPreview()}
          </Box>
        </Paper>
      </Grid>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default PortfolioCreator; 