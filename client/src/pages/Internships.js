import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  LinearProgress,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  CircularProgress,
  Rating,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Slide,
  Skeleton,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import {
  Search as SearchIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  LocationOn as LocationIcon,
  FilterList as FilterIcon,
  Share as ShareIcon,
  Close as CloseIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Sort as SortIcon,
  WorkOutline as WorkIcon,
  Star as StarIcon,
  AccessTime as AccessTimeIcon,
  Business as BusinessIcon,
  Check as CheckIcon,
  Money as MoneyIcon,
  AttachMoney as AttachMoneyIcon,
  EventNote as EventNoteIcon,
  CalendarToday as CalendarTodayIcon,
  PeopleAlt as PeopleAltIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { applyToInternship } from '../store/slices/internshipSlice';

// Transition component for dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Custom styled components
const InternshipCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  borderRadius: 16,
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.08)',
  borderTop: '4px solid var(--primary)',
  position: 'relative',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.12)',
  },
}));

const MatchPercentage = styled(Chip)(({ theme, match }) => ({
  position: 'absolute',
  top: -12,
  right: 16,
  fontWeight: 'bold',
  background: match > 85 
    ? 'linear-gradient(to right, var(--primary), var(--accent))' 
    : match > 70 
      ? 'linear-gradient(to right, var(--primary-light), var(--secondary-light))' 
      : 'linear-gradient(to right, var(--warning), var(--accent-light))',
  color: '#fff',
  padding: '0 10px',
  height: '28px',
  border: '2px solid #fff',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  '& .MuiChip-label': {
    fontWeight: 600,
  }
}));

const FilterPaper = styled(Paper)(({ theme }) => ({
  padding: 24,
  borderRadius: 16,
  marginBottom: 32,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  backgroundColor: '#fff',
}));

const LocationChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(114, 9, 183, 0.1)',
  color: 'var(--secondary)',
  border: '1px solid rgba(114, 9, 183, 0.2)',
  transition: 'all 0.2s ease',
  '& .MuiChip-icon': {
    color: 'var(--secondary)',
  },
  '&:hover': {
    backgroundColor: 'rgba(114, 9, 183, 0.15)',
    transform: 'translateY(-2px)',
  },
}));

// Add new styled component for internship details in the card
const InternshipDetailBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  margin: '4px 0',
  '& .MuiSvgIcon-root': {
    marginRight: 8,
    fontSize: '1rem',
  },
  '& .MuiTypography-root': {
    fontSize: '0.875rem',
  }
}));

// Add styled component for the card footer
const CardFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px',
  marginTop: 'auto',
  borderTop: '1px solid rgba(0, 0, 0, 0.06)',
}));

// Add styled component for skills container
const SkillsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  marginBottom: 16,
  '& .MuiChip-root': {
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    }
  }
}));

const InternshipsGrid = styled(Grid)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: 24,
  marginTop: 24,
  marginBottom: 40,
}));

const InternshipsContainer = styled(Container)(({ theme }) => ({
  paddingTop: 40,
  paddingBottom: 60,
}));

const InternshipsHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 24,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  position: 'relative',
  display: 'inline-block',
  marginBottom: 8,
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 80,
    height: 4,
    backgroundColor: 'var(--primary)',
    borderRadius: 2,
  }
}));

const Internships = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { internships: storeInternships, appliedInternships } = useSelector(state => state.internships);
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState([]);
  const [filteredInternships, setFilteredInternships] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    remote: false,
    duration: '',
    skills: [],
    experience: '',
  });
  const [sortOption, setSortOption] = useState('match');
  const [page, setPage] = useState(1);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [applyingInternshipId, setApplyingInternshipId] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [detailsLoading, setDetailsLoading] = useState(false);
  
  // Mock data for development
  const mockInternships = [
    {
      id: 1,
      title: 'Frontend Developer Intern',
      company: 'TechCorp Inc.',
      companyLogo: 'https://randomuser.me/api/portraits/men/32.jpg',
      location: 'San Francisco, CA',
      remote: true,
      duration: '3 months',
      postedDate: '2 days ago',
      description: 'Join our team as a Frontend Developer Intern and work on cutting-edge web applications using modern frameworks like React and Vue. You will collaborate with experienced developers to create responsive user interfaces and improve user experience.',
      requirements: 'Knowledge of HTML, CSS, JavaScript, and experience with modern frontend frameworks like React. Understanding of UI/UX principles and responsive design is a plus. Some experience with version control systems like Git is preferred.',
      skills: ['React', 'JavaScript', 'HTML/CSS', 'UI/UX'],
      applicants: 45,
      deadline: '2024-05-15',
      matchPercentage: 95,
      stipend: '$2500/month',
      saved: false,
      rating: 4.8,
      responsibilities: [
        'Develop responsive user interfaces using React and other frontend technologies',
        'Collaborate with designers to implement UI/UX designs',
        'Optimize applications for maximum speed and scalability',
        'Write clean, maintainable code with proper documentation'
      ],
      maxTeamSize: 4
    },
    {
      id: 2,
      title: 'Backend Developer Intern',
      company: 'DataSystems',
      companyLogo: 'https://randomuser.me/api/portraits/women/44.jpg',
      location: 'Boston, MA',
      remote: false,
      duration: '6 months',
      postedDate: '1 week ago',
      description: 'Work with our engineering team to develop robust backend systems for our enterprise clients. You will help design and implement APIs, data models, and server-side logic to support our growing applications.',
      requirements: 'Strong knowledge of Java or Python, understanding of databases and RESTful APIs. Familiarity with cloud services (AWS/Azure) and containerization technologies like Docker is a plus.',
      skills: ['Java', 'Python', 'SQL', 'Spring Boot'],
      applicants: 37,
      deadline: '2024-05-30',
      matchPercentage: 82,
      stipend: '$2200/month',
      saved: true,
      rating: 4.2,
      responsibilities: [
        'Design and implement robust, scalable backend services',
        'Create and maintain RESTful APIs',
        'Work with databases to optimize data storage and retrieval',
        'Collaborate with frontend developers to integrate user-facing elements'
      ],
      maxTeamSize: 5
    },
    {
      id: 3,
      title: 'UI/UX Design Intern',
      company: 'CreativeStudio',
      companyLogo: 'https://randomuser.me/api/portraits/women/68.jpg',
      location: 'New York, NY',
      remote: true,
      duration: '4 months',
      postedDate: '3 days ago',
      description: 'Join our design team to create beautiful and intuitive user interfaces for web and mobile applications. You will work closely with product managers and developers to bring designs to life.',
      requirements: 'Experience with design tools like Figma or Adobe XD, understanding of UI/UX principles. A portfolio demonstrating your design skills is required. Knowledge of HTML/CSS is a plus.',
      skills: ['Figma', 'UI Design', 'Wireframing', 'Prototyping'],
      applicants: 23,
      deadline: '2024-06-10',
      matchPercentage: 88,
      stipend: '$2000/month',
      saved: false,
      rating: 4.5,
      responsibilities: [
        'Create wireframes, mockups, and prototypes for web and mobile applications',
        'Conduct user research and usability testing',
        'Collaborate with developers to implement designs',
        'Create and maintain design systems'
      ],
      maxTeamSize: 3
    },
    {
      id: 4,
      title: 'Data Science Intern',
      company: 'AnalyticsPro',
      companyLogo: 'https://randomuser.me/api/portraits/men/76.jpg',
      location: 'Chicago, IL',
      remote: true,
      duration: '3 months',
      postedDate: '5 days ago',
      description: 'Work with our data science team to analyze large datasets and develop machine learning models. You will help extract insights from data and contribute to predictive analytics projects.',
      requirements: 'Knowledge of Python, experience with data analysis libraries like pandas and numpy. Familiarity with machine learning frameworks (TensorFlow, PyTorch) and statistical analysis is preferred.',
      skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL'],
      applicants: 56,
      deadline: '2024-05-20',
      matchPercentage: 73,
      stipend: '$2300/month',
      saved: false,
      rating: 4.0,
      responsibilities: [
        'Clean and preprocess large datasets',
        'Build and evaluate machine learning models',
        'Visualize data and communicate findings',
        'Collaborate with cross-functional teams to implement data-driven solutions'
      ],
      maxTeamSize: 6
    },
    {
      id: 5,
      title: 'Mobile App Developer Intern',
      company: 'AppWorks',
      companyLogo: 'https://randomuser.me/api/portraits/women/22.jpg',
      location: 'Seattle, WA',
      remote: false,
      duration: '4 months',
      postedDate: '1 day ago',
      description: 'Join our mobile development team to build cutting-edge iOS and Android applications. You will work on real projects that reach thousands of users while learning from experienced developers.',
      requirements: 'Knowledge of Swift or Kotlin/Java, experience with mobile app development. Familiarity with mobile UI design principles and app store deployment processes is a plus.',
      skills: ['iOS', 'Android', 'Swift', 'Kotlin'],
      applicants: 42,
      deadline: '2024-06-05',
      matchPercentage: 79,
      stipend: '$2400/month',
      saved: false,
      rating: 4.3,
      responsibilities: [
        'Develop features for iOS and Android applications',
        'Fix bugs and improve application performance',
        'Work with designers to implement mobile UI/UX',
        'Participate in code reviews and testing'
      ],
      maxTeamSize: 4
    },
    {
      id: 6,
      title: 'DevOps Engineering Intern',
      company: 'CloudSystems',
      companyLogo: 'https://randomuser.me/api/portraits/men/52.jpg',
      location: 'Austin, TX',
      remote: true,
      duration: '6 months',
      postedDate: '4 days ago',
      description: 'Gain hands-on experience with cloud infrastructure and DevOps practices. You will help automate deployment processes, manage cloud resources, and improve system reliability.',
      requirements: 'Knowledge of Linux, understanding of CI/CD pipelines, and experience with cloud platforms (AWS, Azure, or GCP). Familiarity with container orchestration tools like Kubernetes is a plus.',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      applicants: 31,
      deadline: '2024-06-15',
      matchPercentage: 68,
      stipend: '$2600/month',
      saved: false,
      rating: 4.6,
      responsibilities: [
        'Automate deployment and infrastructure management',
        'Monitor system performance and reliability',
        'Implement security best practices',
        'Collaborate with development teams to improve deployment processes'
      ],
      maxTeamSize: 3
    }
  ];

  useEffect(() => {
    // Simulate API fetch
    const fetchInternships = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        // const response = await api.get('/internships');
        // setInternships(response.data);
        
        // Using mock data for development
        setTimeout(() => {
          setInternships(mockInternships);
          setFilteredInternships(mockInternships);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching internships:', error);
        setLoading(false);
      }
    };
    
    fetchInternships();
  }, []);

  // Filter and sort internships
  useEffect(() => {
    let results = [...internships];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        internship => 
          internship.title.toLowerCase().includes(query) ||
          internship.company.toLowerCase().includes(query) ||
          internship.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }
    
    // Apply location filter
    if (filters.location) {
      results = results.filter(
        internship => internship.location.includes(filters.location)
      );
    }
    
    // Apply remote filter
    if (filters.remote) {
      results = results.filter(internship => internship.remote);
    }
    
    // Apply duration filter
    if (filters.duration) {
      results = results.filter(internship => internship.duration === filters.duration);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'match':
        results.sort((a, b) => b.matchPercentage - a.matchPercentage);
        break;
      case 'recent':
        results.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        break;
      case 'deadline':
        results.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        break;
      case 'stipend':
        results.sort((a, b) => {
          const aValue = parseInt(a.stipend.replace(/\D/g, ''));
          const bValue = parseInt(b.stipend.replace(/\D/g, ''));
          return bValue - aValue;
        });
        break;
      default:
        break;
    }
    
    setFilteredInternships(results);
  }, [internships, searchQuery, filters, sortOption]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1); // Reset to first page when search changes
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    setPage(1); // Reset to first page when filters change
  };

  const toggleFilterDrawer = (open) => {
    setFilterDrawerOpen(open);
  };

  const toggleSaveInternship = (id) => {
    setInternships(internships.map(internship => 
      internship.id === id 
        ? { ...internship, saved: !internship.saved } 
        : internship
    ));
  };

  const itemsPerPage = 8;
  const pageCount = Math.ceil(filteredInternships.length / itemsPerPage);
  const currentInternships = filteredInternships.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  const handleOpenDetails = (internship) => {
    setSelectedInternship(null);
    setDetailsLoading(true);
    setDetailsDialogOpen(true);
    
    // Simulate API call to get full internship details
    setTimeout(() => {
      setSelectedInternship(internship);
      setDetailsLoading(false);
    }, 800);
  };

  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
  };

  const handleApplyInternship = async (internshipId) => {
    // Check authentication
    if (!user) {
      setNotification({
        open: true,
        message: 'Please log in to apply for internships',
        severity: 'warning'
      });
      return;
    }
    
    setApplyingInternshipId(internshipId);
    
    try {
      // Simulate API call to apply for internship
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add internship to applied list using Redux
      dispatch(applyToInternship(internshipId));
      
      // Show success notification
      setNotification({
        open: true,
        message: 'You have successfully applied for this internship!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error applying for internship:', error);
      setNotification({
        open: true,
        message: 'Failed to apply for internship. Please try again.',
        severity: 'error'
      });
    } finally {
      setApplyingInternshipId(null);
    }
  };

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  const isInternshipApplied = (internshipId) => {
    return appliedInternships.includes(internshipId);
  };

  const filterDrawer = (
    <Drawer
      anchor="right"
      open={filterDrawerOpen}
      onClose={() => toggleFilterDrawer(false)}
      PaperProps={{
        sx: { width: 320, padding: 3 },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={() => toggleFilterDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <List>
        <ListItem>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Location</InputLabel>
            <Select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              label="Location"
            >
              <MenuItem value="">Any Location</MenuItem>
              <MenuItem value="San Francisco">San Francisco</MenuItem>
              <MenuItem value="New York">New York</MenuItem>
              <MenuItem value="Boston">Boston</MenuItem>
              <MenuItem value="Chicago">Chicago</MenuItem>
            </Select>
          </FormControl>
        </ListItem>
        
        <ListItem>
          <FormControlLabel
            control={
              <Switch
                checked={filters.remote}
                onChange={(e) => handleFilterChange('remote', e.target.checked)}
                color="primary"
              />
            }
            label="Remote Only"
          />
        </ListItem>
        
        <ListItem>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Duration</InputLabel>
            <Select
              value={filters.duration}
              onChange={(e) => handleFilterChange('duration', e.target.value)}
              label="Duration"
            >
              <MenuItem value="">Any Duration</MenuItem>
              <MenuItem value="3 months">3 months</MenuItem>
              <MenuItem value="4 months">4 months</MenuItem>
              <MenuItem value="6 months">6 months</MenuItem>
            </Select>
          </FormControl>
        </ListItem>
        
        <ListItem>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Experience Level</InputLabel>
            <Select
              value={filters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
              label="Experience Level"
            >
              <MenuItem value="">Any Level</MenuItem>
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>
          </FormControl>
        </ListItem>
      </List>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          onClick={() => {
            setFilters({
              location: '',
              remote: false,
              duration: '',
              skills: [],
              experience: '',
            });
          }}
        >
          Clear All
        </Button>
        <Button 
          variant="contained" 
          onClick={() => toggleFilterDrawer(false)}
        >
          Apply Filters
        </Button>
      </Box>
    </Drawer>
  );

  // Create internship details dialog
  const internshipDetailsDialog = (
    <Dialog
      open={detailsDialogOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleCloseDetails}
      fullWidth
      maxWidth="md"
      scroll="paper"
      aria-labelledby="internship-details-title"
    >
      <DialogTitle id="internship-details-title" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {detailsLoading ? (
          <Skeleton width="60%" height={40} />
        ) : (
          selectedInternship?.title
        )}
        <IconButton aria-label="close" onClick={handleCloseDetails}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        {detailsLoading ? (
          // Loading skeleton
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Skeleton variant="circular" width={50} height={50} />
              <Box sx={{ ml: 2, width: '100%' }}>
                <Skeleton width="40%" height={24} />
                <Skeleton width="30%" height={20} />
              </Box>
            </Box>
            <Skeleton width="90%" height={60} />
            <Skeleton width="100%" height={80} />
            <Box sx={{ mt: 2 }}>
              <Skeleton width="40%" height={30} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1, gap: 1 }}>
                <Skeleton width={80} height={32} />
                <Skeleton width={80} height={32} />
                <Skeleton width={80} height={32} />
              </Box>
            </Box>
          </>
        ) : selectedInternship ? (
          <>
            {/* Company Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar 
                src={selectedInternship.companyLogo} 
                alt={selectedInternship.company}
                sx={{ width: 60, height: 60 }}
              />
              <Box sx={{ ml: 2 }}>
                <Typography variant="h6" color="primary">
                  {selectedInternship.company}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating 
                    value={selectedInternship.rating} 
                    precision={0.1} 
                    readOnly 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2">
                    {selectedInternship.rating} Stars
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* Match Percentage */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Chip 
                label={`${selectedInternship.matchPercentage}% Match for You`} 
                color={selectedInternship.matchPercentage > 85 ? "primary" : "default"}
                icon={<StarIcon />}
                sx={{ 
                  fontWeight: 'bold', 
                  background: selectedInternship.matchPercentage > 85 
                    ? 'linear-gradient(to right, var(--primary), var(--accent))' 
                    : null,
                  color: selectedInternship.matchPercentage > 85 ? '#fff' : null
                }}
              />
            </Box>

            {/* Key Details */}
            <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      <strong>Location:</strong> {selectedInternship.location}
                      {selectedInternship.remote && ' (Remote Available)'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachMoneyIcon sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="body1">
                      <strong>Stipend:</strong> {selectedInternship.stipend}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ mr: 1, color: 'secondary.main' }} />
                    <Typography variant="body1">
                      <strong>Duration:</strong> {selectedInternship.duration}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarTodayIcon sx={{ mr: 1, color: 'warning.main' }} />
                    <Typography variant="body1">
                      <strong>Application Deadline:</strong> {new Date(selectedInternship.deadline).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleAltIcon sx={{ mr: 1, color: 'info.main' }} />
                    <Typography variant="body1">
                      <strong>Applicants:</strong> {selectedInternship.applicants}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EventNoteIcon sx={{ mr: 1, color: 'error.main' }} />
                    <Typography variant="body1">
                      <strong>Posted:</strong> {selectedInternship.postedDate}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>

            {/* Description */}
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {selectedInternship.description}
            </Typography>
            
            {/* Requirements */}
            <Typography variant="h6" gutterBottom>
              Requirements
            </Typography>
            <Typography variant="body1" paragraph>
              {selectedInternship.requirements}
            </Typography>
            
            {/* Responsibilities */}
            <Typography variant="h6" gutterBottom>
              Responsibilities
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 3 }}>
              {selectedInternship.responsibilities.map((responsibility, index) => (
                <Box component="li" key={index} sx={{ mb: 1 }}>
                  <Typography variant="body1">
                    {responsibility}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            {/* Required Skills */}
            <Typography variant="h6" gutterBottom>
              Required Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {selectedInternship.skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  variant="outlined"
                  color="primary"
                />
              ))}
            </Box>
          </>
        ) : null}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button 
          onClick={handleCloseDetails}
          variant="outlined"
        >
          Close
        </Button>
        
        {!detailsLoading && selectedInternship && (
          isInternshipApplied(selectedInternship.id) ? (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckIcon />}
              disabled
            >
              Applied Successfully
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleApplyInternship(selectedInternship.id)}
              disabled={applyingInternshipId === selectedInternship.id}
              startIcon={applyingInternshipId === selectedInternship.id ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {applyingInternshipId === selectedInternship.id ? 'Applying...' : 'Apply for Internship'}
            </Button>
          )
        )}
      </DialogActions>
    </Dialog>
  );

  return (
    <InternshipsContainer maxWidth="lg">
      <InternshipsHeader>
        <Box>
          <SectionTitle variant="h4" component="h1" gutterBottom>
            Discover Internships
          </SectionTitle>
          <Typography variant="body1" color="text.secondary">
            Find the perfect internship to kickstart your career
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<FilterIcon />}
          onClick={() => setFilterDrawerOpen(true)}
          size="large"
        >
          Filters
        </Button>
      </InternshipsHeader>

      {/* Search and sort bar */}
      <FilterPaper elevation={0} className="filter-container">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by title, company, or skills..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="sort-label">Sort By</InputLabel>
              <Select
                labelId="sort-label"
                value={sortOption}
                onChange={handleSortChange}
                label="Sort By"
              >
                <MenuItem value="match">Match Percentage</MenuItem>
                <MenuItem value="recent">Most Recent</MenuItem>
                <MenuItem value="stipend">Highest Stipend</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControlLabel
              control={
                <Switch
                  checked={filters.remote}
                  onChange={(e) => handleFilterChange('remote', e.target.checked)}
                  color="primary"
                />
              }
              label="Remote Only"
            />
          </Grid>
        </Grid>
      </FilterPaper>

      {/* Loading state */}
      {loading ? (
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 3 }}>Loading internships...</Typography>
        </Box>
      ) : (
        <>
          {/* Internship listings */}
          <InternshipsGrid>
            {filteredInternships.length > 0 ? (
              filteredInternships.map((internship) => (
                <InternshipCard key={internship.id} className="internship-card card-internship">
                  <MatchPercentage 
                    label={`${internship.matchPercentage}% Match`} 
                    match={internship.matchPercentage}
                    icon={<StarIcon fontSize="small" />}
                    className="internship-match match-badge"
                  />
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={internship.companyLogo} alt={internship.company} sx={{ width: 50, height: 50 }} />
                      <Box sx={{ ml: 1.5 }}>
                        <Typography variant="subtitle1" fontWeight="medium" color="primary.main">
                          {internship.company}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                          {internship.title}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <InternshipDetailBox>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          {internship.location} {internship.remote && <Chip size="small" label="Remote" sx={{ ml: 0.5, height: 20 }} />}
                        </Typography>
                      </InternshipDetailBox>
                      
                      <InternshipDetailBox>
                        <AccessTimeIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          Duration: {internship.duration}
                        </Typography>
                      </InternshipDetailBox>
                      
                      <InternshipDetailBox>
                        <AttachMoneyIcon fontSize="small" color="success" />
                        <Typography variant="body2" color="success.main" fontWeight="bold">
                          Stipend: {internship.stipend}
                        </Typography>
                      </InternshipDetailBox>
                      
                      <InternshipDetailBox>
                        <CalendarTodayIcon fontSize="small" color="warning" />
                        <Typography variant="body2" color="text.secondary">
                          Deadline: {new Date(internship.deadline).toLocaleDateString()}
                        </Typography>
                      </InternshipDetailBox>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {internship.description.substring(0, 100)}...
                    </Typography>
                    
                    <SkillsContainer>
                      {internship.skills.map((skill) => (
                        <Chip 
                          key={skill} 
                          label={skill} 
                          size="small" 
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </SkillsContainer>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      onClick={() => handleOpenDetails(internship)}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      View Details
                    </Button>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {isInternshipApplied(internship.id) && (
                        <Chip
                          label="Applied"
                          size="small"
                          color="success"
                          icon={<CheckIcon />}
                          sx={{ mr: 1 }}
                        />
                      )}
                      <IconButton
                        onClick={() => toggleSaveInternship(internship.id)}
                        color={internship.saved ? "primary" : "default"}
                        size="small"
                      >
                        {internship.saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                      </IconButton>
                    </Box>
                  </CardFooter>
                </InternshipCard>
              ))
            ) : (
              <Box sx={{ p: 4, textAlign: 'center', gridColumn: '1 / -1' }}>
                <Typography variant="h6">No internships found</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try adjusting your search filters or keywords
                </Typography>
              </Box>
            )}
          </InternshipsGrid>

          {/* Pagination */}
          {filteredInternships.length > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(filteredInternships.length / 8)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Filter drawer */}
      <Drawer
        anchor="right"
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
      >
        <Box sx={{ width: 300, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">Filter Internships</Typography>
            <IconButton onClick={() => setFilterDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Location</Typography>
          <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 3 }}>
            <Select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Any Location</MenuItem>
              <MenuItem value="San Francisco">San Francisco</MenuItem>
              <MenuItem value="New York">New York</MenuItem>
              <MenuItem value="Boston">Boston</MenuItem>
              <MenuItem value="Chicago">Chicago</MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Duration</Typography>
          <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 3 }}>
            <Select
              value={filters.duration}
              onChange={(e) => handleFilterChange('duration', e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Any Duration</MenuItem>
              <MenuItem value="3 months">3 months</MenuItem>
              <MenuItem value="4 months">4 months</MenuItem>
              <MenuItem value="6 months">6 months</MenuItem>
            </Select>
          </FormControl>
          
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Experience Level</Typography>
          <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 3 }}>
            <Select
              value={filters.experience}
              onChange={(e) => handleFilterChange('experience', e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Any Level</MenuItem>
              <MenuItem value="beginner">Beginner (0-1 year)</MenuItem>
              <MenuItem value="intermediate">Intermediate (1-3 years)</MenuItem>
              <MenuItem value="advanced">Advanced (3+ years)</MenuItem>
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={
              <Switch
                checked={filters.remote}
                onChange={(e) => handleFilterChange('remote', e.target.checked)}
                color="primary"
              />
            }
            label="Remote Only"
            sx={{ mb: 3 }}
          />
          
          <Button 
            variant="contained" 
            fullWidth
            className="btn btn-secondary"
            onClick={() => {
              setFilters({
                location: '',
                remote: false,
                duration: '',
                skills: [],
                experience: '',
              });
            }}
          >
            Reset Filters
          </Button>
        </Box>
      </Drawer>

      {/* Add the details dialog to the component */}
      {internshipDetailsDialog}
      
      {/* Add the notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </InternshipsContainer>
  );
};

export default Internships; 