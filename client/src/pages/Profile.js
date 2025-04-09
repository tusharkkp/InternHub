import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { styled, alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import {
  Container, Box, Paper, Grid, Typography, Avatar, Button, IconButton,
  TextField, Chip, List, ListItem, ListItemText, ListItemIcon, Divider,
  Card, CardContent, CardMedia, CardActionArea, CardActions,
  LinearProgress, Tab, Tabs, CircularProgress, Badge, Link as MuiLink,
  Snackbar, Alert, Tooltip, Menu, MenuItem, FormControlLabel, Switch
} from '@mui/material';
import {
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Link as LinkIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  Close as CloseIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  ThumbUp as EndorsementIcon,
  Timeline as TimelineConnector,
  CalendarToday as DateIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Language as LanguageIcon,
  MoreVert as MoreVertIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Visibility as VisibilityIcon,
  AspectRatio as AspectRatioIcon,
  Folder as ProjectsIcon,
  MenuBook as MenuBookIcon,
  Timeline as TimelineIcon,
  HowToReg as HowToRegIcon,
  ContactMail as ContactIcon,
  EmojiEvents as EmojiEventsIcon,
  Person as PersonIcon,
  Assessment as AssessmentIcon,
  Create as CreateIcon,
} from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import SkillsRadar from '../components/profile/SkillsRadar';
import Portfolio from '../components/profile/Portfolio';
import LearningPath from '../components/profile/LearningPath';
import SkillAssessment from '../components/profile/SkillAssessment';
import CareerDashboard from '../components/career/CareerDashboard';
import PortfolioCreator from '../components/resume/PortfolioCreator';

// Styled components
const ProfileHeaderPaper = styled(Paper)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[3],
}));

const ProfileBackgroundCover = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: '250px',
  background: '#ADD8E6', // Light sky blue background
  backgroundImage: 'linear-gradient(to right, #ADD8E6, #87CEEB)', // Gradient variation of sky blue
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to bottom, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.5) 100%)',
    zIndex: 1
  }
}));

const ProfileTextContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  padding: theme.spacing(3),
  paddingTop: theme.spacing(1),
  color: '#333333', // Darker text for better contrast
}));

const LargeAvatar = styled(Avatar)(({ theme }) => ({
  width: 160,
  height: 160,
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  border: `5px solid ${theme.palette.background.paper}`,
  position: 'relative',
  zIndex: 2,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  '&.MuiChip-outlined': {
    borderColor: theme.palette.primary.main,
    borderWidth: 1.5,
  },
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  color: '#0066cc', // Blue color for social icons
  backgroundColor: 'rgba(255, 255, 255, 0.9)', // More opaque white background
  margin: theme.spacing(0.5),
  transition: 'all 0.2s ease',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  '&:hover': {
    color: '#004d99', // Darker blue on hover
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 6px rgba(0,0,0,0.12)',
  },
}));

const EndorsementBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  fontWeight: 'bold',
  boxShadow: theme.shadows[1],
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  minWidth: 80,
  borderRadius: '8px 8px 0 0',
  padding: theme.spacing(1, 2),
  transition: 'all 0.2s ease',
  [theme.breakpoints.up('sm')]: {
    minWidth: 120,
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(13, 71, 161, 0.08)',
    color: theme.palette.primary.main,
    transform: 'translateY(-2px)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  '&:hover': {
    backgroundColor: 'rgba(13, 71, 161, 0.04)',
    transform: 'translateY(-1px)',
  },
}));

const TabPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
}));

const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
  },
}));

const TimelineDot = styled(Box)(({ theme }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  margin: '8px 0',
  display: 'inline-block',
}));

const Profile = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [isEditingAchievements, setIsEditingAchievements] = useState(false);
  const [newSkill, setNewSkill] = useState({ name: '', level: 50 });
  const [newEducation, setNewEducation] = useState({
    school: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    activities: ''
  });
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    description: ''
  });
  const [newAchievement, setNewAchievement] = useState('');
  const [profilePicture, setProfilePicture] = useState("https://randomuser.me/api/portraits/men/41.jpg");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const fileInputRef = React.useRef(null);
  
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user: authUser, isAuthenticated, loading } = useSelector(state => state.auth);
  
  // Use either the profile user from params or the authenticated user
  const profileUser = id ? { /* Fetch user by id */ } : authUser;
  const isOwnProfile = !id || (isAuthenticated && authUser?._id === id);

  // Mock data for development
  const [userData, setUserData] = useState({
    name: 'Alex Johnson',
    title: 'Computer Science Student',
    bio: 'Passionate about web development and machine learning. Currently studying Computer Science at Stanford University. Looking for internship opportunities in software development.',
    location: 'San Francisco, CA',
    email: 'alex.johnson@example.com',
    website: 'https://alexjohnson.dev',
    social: {
      linkedin: 'https://linkedin.com/in/alexjohnson',
      github: 'https://github.com/alexjohnson',
      twitter: 'https://twitter.com/alexjohnson',
    },
    skills: [
      { name: 'JavaScript', level: 85, endorsements: 12 },
      { name: 'React.js', level: 78, endorsements: 8 },
      { name: 'Node.js', level: 65, endorsements: 5 },
      { name: 'Python', level: 70, endorsements: 7 },
      { name: 'Machine Learning', level: 55, endorsements: 3 },
      { name: 'UI/UX Design', level: 60, endorsements: 4 },
    ],
    experience: [
      {
        title: 'Web Development Intern',
        company: 'TechStart Inc.',
        location: 'Remote',
        startDate: 'June 2023',
        endDate: 'August 2023',
        description: 'Developed responsive web applications using React.js and implemented RESTful APIs with Node.js and Express.',
      },
      {
        title: 'Research Assistant',
        company: 'Stanford AI Lab',
        location: 'Stanford, CA',
        startDate: 'January 2023',
        endDate: 'May 2023',
        description: 'Assisted in research on neural networks and natural language processing applications.',
      },
    ],
    education: [
      {
        school: 'Stanford University',
        degree: 'Bachelor of Science in Computer Science',
        fieldOfStudy: 'Computer Science',
        startDate: '2021',
        endDate: '2025 (Expected)',
        activities: 'AI Club, Hackathon Team Lead',
      },
    ],
    projects: [
      {
        title: 'E-commerce Platform',
        description: 'A full-stack e-commerce platform built with React, Node.js, and MongoDB.',
        githubUrl: 'https://github.com/alexjohnson/ecommerce',
        demoUrl: 'https://ecommerce-demo.alexjohnson.dev',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'AI Chat Assistant',
        description: 'An AI-powered chat assistant using natural language processing techniques.',
        githubUrl: 'https://github.com/alexjohnson/ai-chat',
        demoUrl: 'https://ai-chat.alexjohnson.dev',
        technologies: ['Python', 'TensorFlow', 'Flask', 'React'],
        image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Portfolio Website',
        description: 'A modern, responsive portfolio website showcasing my projects and skills.',
        githubUrl: 'https://github.com/alexjohnson/portfolio',
        demoUrl: 'https://alexjohnson.dev',
        technologies: ['React', 'CSS', 'Framer Motion', 'Netlify'],
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      },
      {
        title: 'Weather Dashboard App',
        description: 'Real-time weather application with forecast and historical data visualization.',
        githubUrl: 'https://github.com/alexjohnson/weather-app',
        demoUrl: 'https://weather.alexjohnson.dev',
        technologies: ['JavaScript', 'Chart.js', 'Weather API', 'Bootstrap'],
        image: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
      },
    ],
    achievements: [
      'First Place in University Hackathon 2023',
      'Dean\'s List 2021-2022',
      'Google Developer Student Club Lead',
    ],
  });

  // For development purposes, use mock data
  const user = profileUser || userData;

  useEffect(() => {
    // Fetch user profile data if needed
    // If using param id, fetch that user's profile
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const toggleSkillsEdit = () => {
    setIsEditingSkills(!isEditingSkills);
  };

  const toggleEducationEdit = () => {
    setIsEditingEducation(!isEditingEducation);
    if (isEditingEducation) {
      setNewEducation({
        school: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        activities: ''
      });
    }
  };

  const toggleExperienceEdit = () => {
    setIsEditingExperience(!isEditingExperience);
    if (isEditingExperience) {
      setNewExperience({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      });
    }
  };

  const toggleAchievementsEdit = () => {
    setIsEditingAchievements(!isEditingAchievements);
    if (isEditingAchievements) {
      setNewAchievement('');
    }
  };

  const handleSkillChange = (e) => {
    setNewSkill({
      ...newSkill,
      [e.target.name]: e.target.name === 'level' ? Number(e.target.value) : e.target.value
    });
  };

  const handleEducationChange = (e) => {
    setNewEducation({
      ...newEducation,
      [e.target.name]: e.target.value
    });
  };

  const handleExperienceChange = (e) => {
    setNewExperience({
      ...newExperience,
      [e.target.name]: e.target.value
    });
  };

  const handleAchievementChange = (e) => {
    setNewAchievement(e.target.value);
  };

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setUserData({
        ...userData,
        skills: [...userData.skills, { ...newSkill, endorsements: 0 }]
      });
      setNewSkill({ name: '', level: 50 });
    }
  };

  const addEducation = () => {
    if (newEducation.school.trim() && newEducation.degree.trim()) {
      setUserData({
        ...userData,
        education: [...userData.education, newEducation]
      });
      setNewEducation({
        school: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        activities: ''
      });
      setShowSuccessNotification(true);
    }
  };

  const addExperience = () => {
    if (newExperience.title.trim() && newExperience.company.trim()) {
      setUserData({
        ...userData,
        experience: [...userData.experience, newExperience]
      });
      setNewExperience({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      });
      setShowSuccessNotification(true);
    }
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setUserData({
        ...userData,
        achievements: [...userData.achievements, newAchievement]
      });
      setNewAchievement('');
      setShowSuccessNotification(true);
    }
  };

  const removeSkill = (skillName) => {
    setUserData({
      ...userData,
      skills: userData.skills.filter(skill => skill.name !== skillName)
    });
  };

  const removeEducation = (index) => {
    const updatedEducation = [...userData.education];
    updatedEducation.splice(index, 1);
    setUserData({
      ...userData,
      education: updatedEducation
    });
    setShowSuccessNotification(true);
  };

  const removeExperience = (index) => {
    const updatedExperience = [...userData.experience];
    updatedExperience.splice(index, 1);
    setUserData({
      ...userData,
      experience: updatedExperience
    });
    setShowSuccessNotification(true);
  };

  const removeAchievement = (index) => {
    const updatedAchievements = [...userData.achievements];
    updatedAchievements.splice(index, 1);
    setUserData({
      ...userData,
      achievements: updatedAchievements
    });
    setShowSuccessNotification(true);
  };

  const updateSkill = (index, field, value) => {
    const updatedSkills = [...userData.skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: field === 'level' ? Number(value) : value
    };
    
    setUserData({
      ...userData,
      skills: updatedSkills
    });
  };

  const saveProfile = () => {
    // Here you would typically dispatch an action to update the profile
    // For now, we'll just toggle out of edit mode
    setIsEditing(false);
    setIsEditingSkills(false);
    
    // In a real app:
    // dispatch(updateProfile(userData));
    setShowSuccessNotification(true);
  };

  // Handle profile picture change
  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Reset error state
    setUploadError("");
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError("Please select a valid image file (JPEG, PNG, or GIF)");
      return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setUploadError("File size should not exceed 5MB");
      return;
    }
    
    // Set uploading state
    setIsUploading(true);
    
    // Create file reader
    const reader = new FileReader();
    reader.onload = (e) => {
      // Update profile picture with new image
      setProfilePicture(e.target.result);
      setIsUploading(false);
      setShowSuccessNotification(true);
      
      // In a real app, here you would upload the image to your server/cloud storage
      // For example:
      // const formData = new FormData();
      // formData.append('profilePicture', file);
      // await api.post('/user/profile-picture', formData);
    };
    reader.onerror = () => {
      setIsUploading(false);
      setUploadError("Error reading file");
    };
    
    // Read file as data URL
    reader.readAsDataURL(file);
  };

  // Render the user's basic info section
  const renderBasicInfo = () => {
    // Make sure the user object exists and necessary arrays are available
    const educationData = userData?.education || [];
    const experienceData = userData?.experience || [];
    const skillsData = userData?.skills || [];
    const achievementsData = userData?.achievements || [];

    return (
      <Box>
        {/* Education Section */}
        <SectionPaper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <SectionTitle variant="h6">
              <SchoolIcon /> Education
            </SectionTitle>
            {isOwnProfile && (
              <Button 
                variant="outlined" 
                size="small"
                startIcon={isEditingEducation ? null : <EditIcon />}
                onClick={toggleEducationEdit}
                sx={{ 
                  borderRadius: 2,
                  borderWidth: 1.5,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                }}
              >
                {isEditingEducation ? 'Done' : 'Edit Education'}
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {isEditingEducation && (
            <Box sx={{ mb: 4, p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Add New Education
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="school"
                    label="School/University"
                    variant="outlined"
                    size="small"
                    value={newEducation.school}
                    onChange={handleEducationChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="degree"
                    label="Degree"
                    variant="outlined"
                    size="small"
                    value={newEducation.degree}
                    onChange={handleEducationChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="fieldOfStudy"
                    label="Field of Study"
                    variant="outlined"
                    size="small"
                    value={newEducation.fieldOfStudy}
                    onChange={handleEducationChange}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    name="startDate"
                    label="Start Date"
                    variant="outlined"
                    size="small"
                    value={newEducation.startDate}
                    onChange={handleEducationChange}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    name="endDate"
                    label="End Date"
                    variant="outlined"
                    size="small"
                    value={newEducation.endDate}
                    onChange={handleEducationChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="activities"
                    label="Activities & Societies"
                    variant="outlined"
                    size="small"
                    value={newEducation.activities}
                    onChange={handleEducationChange}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={addEducation}
                disabled={!newEducation.school.trim() || !newEducation.degree.trim()}
                sx={{ mr: 1 }}
              >
                Add Education
              </Button>
              <Button 
                variant="outlined" 
                onClick={toggleEducationEdit}
              >
                Cancel
              </Button>
            </Box>
          )}
          
          {educationData.length > 0 ? (
            educationData.map((edu, index) => (
              <Box key={index} sx={{ mb: index !== educationData.length - 1 ? 3 : 0, position: 'relative' }}>
                {isEditingEducation && (
                  <IconButton 
                    size="small" 
                    color="error" 
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                    onClick={() => removeEducation(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar 
                      variant="rounded" 
                      sx={{ 
                        bgcolor: 'primary.light', 
                        width: 56, 
                        height: 56,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <SchoolIcon />
                    </Avatar>
                    {index !== educationData.length - 1 && (
                      <TimelineConnector sx={{ mt: 1, height: 40 }} />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {edu.school}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 500 }}>
                      {edu.degree}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {edu.startDate} - {edu.endDate}
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                      {edu.activities}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No education information available
            </Typography>
          )}
        </SectionPaper>
        
        {/* Experience Section */}
        <SectionPaper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <SectionTitle variant="h6">
              <WorkIcon /> Professional Experience
            </SectionTitle>
            {isOwnProfile && (
              <Button 
                variant="outlined" 
                size="small"
                startIcon={isEditingExperience ? null : <EditIcon />}
                onClick={toggleExperienceEdit}
                sx={{ 
                  borderRadius: 2,
                  borderWidth: 1.5,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                }}
              >
                {isEditingExperience ? 'Done' : 'Edit Experience'}
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {isEditingExperience && (
            <Box sx={{ mb: 4, p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Add New Experience
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="title"
                    label="Job Title"
                    variant="outlined"
                    size="small"
                    value={newExperience.title}
                    onChange={handleExperienceChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    name="company"
                    label="Company"
                    variant="outlined"
                    size="small"
                    value={newExperience.company}
                    onChange={handleExperienceChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="location"
                    label="Location"
                    variant="outlined"
                    size="small"
                    value={newExperience.location}
                    onChange={handleExperienceChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="startDate"
                    label="Start Date"
                    variant="outlined"
                    size="small"
                    value={newExperience.startDate}
                    onChange={handleExperienceChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="endDate"
                    label="End Date"
                    variant="outlined"
                    size="small"
                    value={newExperience.endDate}
                    onChange={handleExperienceChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name="description"
                    label="Job Description"
                    variant="outlined"
                    size="small"
                    value={newExperience.description}
                    onChange={handleExperienceChange}
                    multiline
                    rows={3}
                  />
                </Grid>
              </Grid>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={addExperience}
                disabled={!newExperience.title.trim() || !newExperience.company.trim()}
                sx={{ mr: 1 }}
              >
                Add Experience
              </Button>
              <Button 
                variant="outlined" 
                onClick={toggleExperienceEdit}
              >
                Cancel
              </Button>
            </Box>
          )}
          
          {experienceData.length > 0 ? (
            experienceData.map((exp, index) => (
              <Box key={index} sx={{ mb: index !== experienceData.length - 1 ? 3 : 0, position: 'relative' }}>
                {isEditingExperience && (
                  <IconButton 
                    size="small" 
                    color="error" 
                    sx={{ position: 'absolute', top: 0, right: 0 }}
                    onClick={() => removeExperience(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar 
                      variant="rounded" 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        width: 56, 
                        height: 56,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      <WorkIcon />
                    </Avatar>
                    {index !== experienceData.length - 1 && (
                      <TimelineConnector sx={{ mt: 1, height: 40 }} />
                    )}
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {exp.title}
                    </Typography>
                    <Typography variant="subtitle1" color="primary" gutterBottom sx={{ fontWeight: 500 }}>
                      {exp.company}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon fontSize="small" color="action" sx={{ mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                        {exp.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {exp.startDate} - {exp.endDate}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.primary" sx={{ mt: 1, lineHeight: 1.6 }}>
                      {exp.description}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No professional experience available
            </Typography>
          )}
        </SectionPaper>
        
        {/* Achievements Section */}
        <SectionPaper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <SectionTitle variant="h6">
              <EmojiEventsIcon /> Achievements
            </SectionTitle>
            {isOwnProfile && (
              <Button 
                variant="outlined" 
                size="small"
                startIcon={isEditingAchievements ? null : <EditIcon />}
                onClick={toggleAchievementsEdit}
                sx={{ 
                  borderRadius: 2,
                  borderWidth: 1.5,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                }}
              >
                {isEditingAchievements ? 'Done' : 'Edit Achievements'}
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {isEditingAchievements && (
            <Box sx={{ mb: 4, p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
                Add New Achievement
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Achievement"
                    variant="outlined"
                    size="small"
                    value={newAchievement}
                    onChange={handleAchievementChange}
                    required
                  />
                </Grid>
              </Grid>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={addAchievement}
                disabled={!newAchievement.trim()}
                sx={{ mr: 1 }}
              >
                Add Achievement
              </Button>
              <Button 
                variant="outlined" 
                onClick={toggleAchievementsEdit}
              >
                Cancel
              </Button>
            </Box>
          )}
          
          {achievementsData.length > 0 ? (
            <List>
              {achievementsData.map((achievement, index) => (
                <ListItem 
                  key={index}
                  secondaryAction={
                    isEditingAchievements && (
                      <IconButton edge="end" aria-label="delete" onClick={() => removeAchievement(index)}>
                        <DeleteIcon />
                      </IconButton>
                    )
                  }
                >
                  <ListItemIcon>
                    <EmojiEventsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={achievement} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              No achievements available
            </Typography>
          )}
        </SectionPaper>
        
        {/* Skills Section */}
        <SectionPaper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <SectionTitle variant="h6">
              <EndorsementIcon /> Top Skills
            </SectionTitle>
            {isOwnProfile && (
              <Button 
                variant="outlined" 
                size="small"
                startIcon={isEditingSkills ? null : <EditIcon />}
                onClick={toggleSkillsEdit}
                sx={{ 
                  borderRadius: 2,
                  borderWidth: 1.5,
                  boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
                }}
              >
                {isEditingSkills ? 'Done' : 'Edit Skills'}
              </Button>
            )}
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {isEditingSkills ? (
            <>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    name="name"
                    label="Skill Name"
                    variant="outlined"
                    size="small"
                    value={newSkill.name}
                    onChange={handleSkillChange}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name="level"
                    label="Proficiency (0-100)"
                    variant="outlined"
                    size="small"
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                    value={newSkill.level}
                    onChange={handleSkillChange}
                  />
                </Grid>
              </Grid>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={addSkill}
                disabled={!newSkill.name.trim()}
                sx={{ mb: 3 }}
              >
                Add Skill
              </Button>
              
              <List>
                {skillsData.map((skill, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TextField 
                            value={skill.name}
                            onChange={(e) => updateSkill(index, 'name', e.target.value)}
                            variant="outlined"
                            size="small"
                            sx={{ width: '40%', mr: 2 }}
                          />
                          <TextField 
                            value={skill.level}
                            onChange={(e) => updateSkill(index, 'level', e.target.value)}
                            type="number"
                            InputProps={{ inputProps: { min: 0, max: 100 } }}
                            variant="outlined"
                            size="small"
                            sx={{ width: '30%' }}
                          />
                        </Box>
                      }
                    />
                    <ListItemIcon sx={{ minWidth: 'auto', ml: 2 }}>
                      <IconButton edge="end" onClick={() => removeSkill(skill.name)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemIcon>
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            <Box>
              {skillsData.length > 0 ? (
                <Grid container spacing={3}>
                  {skillsData.map((skill, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: 'rgba(13, 71, 161, 0.04)',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            height: '4px',
                            width: `${skill.level}%`,
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: '0 2px 0 0',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {skill.name}
                          </Typography>
                          <EndorsementBadge 
                            size="small" 
                            label={`${skill.endorsements} ${skill.endorsements === 1 ? 'endorsement' : 'endorsements'}`}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ flexGrow: 1, bgcolor: 'rgba(0,0,0,0.08)', borderRadius: 1, height: 8, mr: 1 }}>
                            <Box
                              sx={{
                                width: `${skill.level}%`,
                                bgcolor: theme.palette.primary.main,
                                height: '100%',
                                borderRadius: 1,
                              }}
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ minWidth: 36 }}>
                            {skill.level}%
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No skills available
                </Typography>
              )}
            </Box>
          )}
        </SectionPaper>
      </Box>
    );
  };

  // Render profile header with user info and actions
  const renderProfileHeader = () => (
    <ProfileHeaderPaper elevation={3}>
      <ProfileBackgroundCover />
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={3} sx={{ 
          mt: { xs: 2, md: 12 }, 
          display: 'flex', 
          justifyContent: 'center',
          position: 'relative'
        }}>
          <Box sx={{ 
            position: 'relative', 
            textAlign: 'center',
            mt: { xs: '80px', md: '20px' },
          }}>
            <LargeAvatar 
              alt={userData.name} 
              src={profilePicture} 
              sx={{ 
                mx: 'auto', 
                mb: 2,
                border: '5px solid white',
                opacity: isUploading ? 0.7 : 1
              }}
            />
            {isUploading && (
              <CircularProgress 
                size={40} 
                sx={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  zIndex: 3
                }}
              />
            )}
            {isOwnProfile && (
              <>
                <Tooltip title="Change profile picture">
                  <IconButton 
                    size="small" 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 10, 
                      right: 10,
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      '&:hover': { backgroundColor: 'white' },
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
                      zIndex: 3
                    }}
                    onClick={() => fileInputRef.current.click()}
                    disabled={isUploading}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  onChange={handleProfilePictureChange}
                />
              </>
            )}
            {uploadError && (
              <Typography 
                variant="caption" 
                color="error" 
                sx={{ display: 'block', mt: 1, backgroundColor: 'rgba(255, 255, 255, 0.95)', p: 1, borderRadius: 1, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)' }}
              >
                {uploadError}
              </Typography>
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12} md={9} sx={{ mt: { xs: 10, md: 4 }, pl: { md: 4 } }}>
          <ProfileTextContainer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                {isEditing ? (
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Title"
                      value={userData.title}
                      onChange={(e) => setUserData({ ...userData, title: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Location"
                      value={userData.location}
                      onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                      InputProps={{
                        startAdornment: <LocationIcon color="action" sx={{ mr: 1 }} />,
                      }}
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      fullWidth
                      label="Website"
                      value={userData.website}
                      onChange={(e) => setUserData({ ...userData, website: e.target.value })}
                      InputProps={{
                        startAdornment: <LinkIcon color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Box>
                ) : (
                  <>
                    <Typography 
                      variant="h4" 
                      component="h1" 
                      gutterBottom 
                      sx={{ 
                        color: '#333333', // Dark text for contrast
                        fontWeight: 700,
                        textShadow: '0 1px 2px rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      {userData.name}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 600,
                        color: '#444444', // Darker text for title
                        mb: 2,
                        textShadow: '0 1px 1px rgba(255, 255, 255, 0.5)'
                      }}
                    >
                      {userData.title}
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 1.5,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)', // More opaque for better contrast
                        backdropFilter: 'blur(4px)',
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.75,
                        width: 'fit-content'
                      }}
                    >
                      <LocationIcon sx={{ mr: 1, color: '#333333' }} />
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: '#333333', // Dark text
                          fontWeight: 500
                        }}
                      >
                        {userData.location}
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.7)', // More opaque for better contrast
                        backdropFilter: 'blur(4px)',
                        borderRadius: 1,
                        px: 1.5,
                        py: 0.75,
                        width: 'fit-content'
                      }}
                    >
                      <LinkIcon sx={{ mr: 1, color: '#333333' }} />
                      <MuiLink 
                        href={userData.website} 
                        target="_blank" 
                        rel="noopener"
                        sx={{ color: '#0066cc', fontWeight: 500 }} // Blue link color for better visibility
                      >
                        {userData.website}
                      </MuiLink>
                    </Box>
                  </>
                )}
                
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <SocialIconButton size="medium" href={userData.social.linkedin} target="_blank">
                    <LinkedInIcon />
                  </SocialIconButton>
                  <SocialIconButton size="medium" href={userData.social.github} target="_blank">
                    <GitHubIcon />
                  </SocialIconButton>
                  <SocialIconButton size="medium" href={userData.social.twitter} target="_blank">
                    <TwitterIcon />
                  </SocialIconButton>
                </Box>
              </Box>
              
              {isOwnProfile && (
                <Box>
                  {isEditing ? (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant="outlined" 
                        color="secondary"
                        onClick={toggleEdit}
                        sx={{
                          borderColor: '#87CEEB', // Sky blue border
                          color: '#0066cc',
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="contained" 
                        onClick={saveProfile}
                        sx={{ 
                          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                          bgcolor: '#0066cc', // Blue button
                          '&:hover': {
                            bgcolor: '#004d99', // Darker blue on hover
                          }
                        }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  ) : (
                    <Button 
                      variant="contained" 
                      startIcon={<EditIcon />}
                      onClick={toggleEdit}
                      sx={{ 
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                        bgcolor: '#0066cc', // Blue button
                        '&:hover': {
                          bgcolor: '#004d99', // Darker blue on hover
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                        }
                      }}
                    >
                      Edit Profile
                    </Button>
                  )}
                </Box>
              )}
            </Box>
            
            {/* Bio Section with improved styling */}
            {isEditing ? (
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Bio"
                value={userData.bio}
                onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                sx={{ mb: 2 }}
              />
            ) : (
              <Box 
                sx={{ 
                  mt: 2, 
                  p: 2, 
                  backgroundColor: 'rgba(173, 216, 230, 0.2)', // Light blue background
                  borderRadius: 2,
                  border: '1px solid rgba(173, 216, 230, 0.5)', // Light blue border
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#333333', // Dark text for better readability
                    lineHeight: 1.7,
                    fontWeight: 400,
                    letterSpacing: '0.015em'
                  }}
                >
                  {userData.bio}
                </Typography>
              </Box>
            )}
          </ProfileTextContainer>
        </Grid>
      </Grid>
    </ProfileHeaderPaper>
  );

  // Render projects section
  const renderProjects = () => {
    const projectsData = userData?.projects || [];
    
    return (
      <SectionPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <SectionTitle variant="h6">
            <ProjectsIcon color="primary" /> Projects
          </SectionTitle>
          {isOwnProfile && (
            <Button 
              variant="outlined" 
              size="small"
              startIcon={<AddIcon />}
              sx={{ 
                borderRadius: 2,
                borderWidth: 1.5,
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
              }}
            >
              Add Project
            </Button>
          )}
        </Box>
        <Divider sx={{ mb: 3 }} />
        
        {projectsData.length > 0 ? (
          <Grid container spacing={3}>
            {projectsData.map((project, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      transform: 'translateY(-4px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.15)'
                    },
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={project.image}
                      alt={project.title}
                      sx={{
                        width: '100%',
                        height: 180,
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        filter: 'brightness(0.95)',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          filter: 'brightness(1.05)'
                        }
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
                        padding: '30px 16px 12px',
                      }}
                    >
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                        {project.title}
                      </Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" paragraph sx={{ mb: 2, flexGrow: 1, lineHeight: 1.6 }}>
                      {project.description}
                    </Typography>
                    <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {project.technologies?.map((tech, i) => (
                        <SkillChip
                          key={i}
                          label={tech}
                          variant="outlined"
                          size="small"
                        />
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                      <Button 
                        size="small"
                        startIcon={<GitHubIcon />}
                        href={project.githubUrl}
                        target="_blank"
                        sx={{ borderRadius: 2 }}
                      >
                        Code
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        href={project.demoUrl}
                        target="_blank"
                        sx={{ borderRadius: 2 }}
                      >
                        Live Demo
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
            No projects available
          </Typography>
        )}
      </SectionPaper>
    );
  };

  // Determine which content to show based on active tab
  const renderTabContent = () => {
    console.log('Active tab:', activeTab);
    console.log('Projects data:', userData.projects);
    switch (activeTab) {
      case 0:
        return (
          <TabPanel>
            {renderBasicInfo()}
          </TabPanel>
        );
      case 1:
        return (
          <TabPanel>
            <SkillsRadar />
          </TabPanel>
        );
      case 2:
        return (
          <TabPanel>
            {renderProjects()}
          </TabPanel>
        );
      case 3:
        return (
          <TabPanel>
            <LearningPath />
          </TabPanel>
        );
      case 4:
        return (
          <TabPanel>
            <SkillAssessment />
          </TabPanel>
        );
      case 5:
        return (
          <TabPanel>
            <CareerDashboard />
          </TabPanel>
        );
      case 6:
        return (
          <TabPanel>
            <PortfolioCreator />
          </TabPanel>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {renderProfileHeader()}
      
      <Paper sx={{ mb: 3, borderRadius: theme.shape.borderRadius, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Profile navigation tabs"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: '3px 3px 0 0'
            },
            bgcolor: 'background.paper',
            px: 2,
            pt: 1
          }}
        >
          <StyledTab icon={<PersonIcon />} iconPosition="start" label="Overview" />
          <StyledTab icon={<AssessmentIcon />} iconPosition="start" label="Skills Dashboard" />
          <StyledTab icon={<WorkIcon />} iconPosition="start" label="Projects" />
          <StyledTab icon={<MenuBookIcon />} iconPosition="start" label="Learning Path" />
          <StyledTab icon={<HowToRegIcon />} iconPosition="start" label="Skill Assessment" />
          <StyledTab icon={<TimelineIcon />} iconPosition="start" label="Career Dashboard" />
          <StyledTab icon={<CreateIcon />} iconPosition="start" label="Portfolio Creator" />
        </Tabs>
        
        {renderTabContent()}
      </Paper>
      
      {/* Notification for successful profile update */}
      <Snackbar
        open={showSuccessNotification}
        autoHideDuration={6000}
        onClose={() => setShowSuccessNotification(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setShowSuccessNotification(false)} 
          severity="success" 
          sx={{ width: '100%', boxShadow: 4 }}
        >
          Profile picture updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 