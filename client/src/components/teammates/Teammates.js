import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider,
  Paper,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Badge,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  Message as MessageIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  MoreVert as MoreVertIcon,
  Send as SendIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  PersonAdd as PersonAddIcon,
  Close as CloseIcon,
  PeopleAlt as PeopleAltIcon
} from '@mui/icons-material';

// Mock data for teammates
const MOCK_TEAMMATES = [
  {
    id: 1,
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    title: 'Frontend Developer',
    bio: 'Passionate about creating intuitive user interfaces and responsive designs.',
    skills: ['React', 'JavaScript', 'CSS', 'UI/UX'],
    projects: ['E-commerce Platform', 'Portfolio Builder'],
    internships: ['Google Summer Internship'],
    role: 'Team Lead',
    isOnline: true,
    lastActive: null
  },
  {
    id: 2,
    name: 'Sophia Lee',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    title: 'Full Stack Developer',
    bio: 'Experienced in building scalable web applications with modern technologies.',
    skills: ['Node.js', 'MongoDB', 'Express', 'React'],
    projects: ['Task Management App', 'Social Media Dashboard'],
    internships: ['Microsoft Student Partners'],
    role: 'Backend Developer',
    isOnline: false,
    lastActive: '10 minutes ago'
  },
  {
    id: 3,
    name: 'Michael Smith',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    title: 'UI/UX Designer',
    bio: 'Focused on creating beautiful and functional user experiences.',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
    projects: ['Mobile Banking App', 'Healthcare Portal'],
    internships: ['Design Internship at Adobe'],
    role: 'Designer',
    isOnline: true,
    lastActive: null
  },
  {
    id: 4,
    name: 'Emily Davis',
    avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
    title: 'Data Scientist',
    bio: 'Passionate about extracting insights from data and building ML models.',
    skills: ['Python', 'TensorFlow', 'Data Analysis', 'Visualization'],
    projects: ['Predictive Analytics Tool', 'Customer Segmentation'],
    internships: ['Data Science Intern at IBM'],
    role: 'Data Analyst',
    isOnline: false,
    lastActive: '1 hour ago'
  },
  {
    id: 5,
    name: 'David Wilson',
    avatar: 'https://randomuser.me/api/portraits/men/54.jpg',
    title: 'DevOps Engineer',
    bio: 'Specializing in CI/CD pipelines and infrastructure as code.',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins'],
    projects: ['Deployment Automation', 'Cloud Migration'],
    internships: ['DevOps Summer Program'],
    role: 'Infrastructure Specialist',
    isOnline: true,
    lastActive: null
  }
];

const Teammates = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTeammates, setFilteredTeammates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedTeammate, setSelectedTeammate] = useState(null);
  const [messageText, setMessageText] = useState('');
  
  // Filter teammates based on search query
  useEffect(() => {
    setLoading(true);
    // Simulate API call delay
    const timer = setTimeout(() => {
      const filtered = MOCK_TEAMMATES.filter(teammate => 
        teammate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teammate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teammate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredTeammates(filtered);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Handler functions
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  
  const handleSortClick = (event) => {
    setSortAnchorEl(event.currentTarget);
  };
  
  const handleSortClose = () => {
    setSortAnchorEl(null);
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleMessageOpen = (teammate) => {
    setSelectedTeammate(teammate);
    setMessageDialogOpen(true);
  };
  
  const handleMessageClose = () => {
    setMessageDialogOpen(false);
    setMessageText('');
  };
  
  const handleSendMessage = () => {
    // Here you would integrate with your messaging API
    console.log(`Message to ${selectedTeammate.name}: ${messageText}`);
    setMessageText('');
    handleMessageClose();
  };
  
  const viewProfile = (teammateId) => {
    navigate(`/profile/${teammateId}`);
  };
  
  // Render teammate cards
  const renderTeammateCard = (teammate) => (
    <Card key={teammate.id} sx={{ 
      mb: 2, 
      borderRadius: 2,
      boxShadow: 2,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4
      },
      position: 'relative',
      overflow: 'visible'
    }}>
      {teammate.isOnline && (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          variant="dot"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            '& .MuiBadge-badge': {
              backgroundColor: '#44b700',
              width: 10,
              height: 10,
              borderRadius: '50%',
              boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
            }
          }}
        />
      )}
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={teammate.avatar}
              alt={teammate.name}
              sx={{ width: 80, height: 80, mb: 1, boxShadow: 2 }}
            />
            <Typography variant="h6" component="div" align="center" gutterBottom>
              {teammate.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              {teammate.isOnline ? 'Online now' : `Last seen: ${teammate.lastActive}`}
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={8}>
            <Typography variant="subtitle1" fontWeight="bold">
              {teammate.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {teammate.bio}
            </Typography>
            
            <Typography variant="body2" sx={{ fontWeight: 'medium', mt: 1 }}>
              Skills:
            </Typography>
            <Box sx={{ mt: 0.5, mb: 1.5 }}>
              {teammate.skills.map((skill, index) => (
                <Chip 
                  key={index} 
                  label={skill} 
                  size="small" 
                  sx={{ mr: 0.5, mb: 0.5 }}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
            
            <Typography variant="body2" sx={{ fontWeight: 'medium', mt: 1 }}>
              Current Activities:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Role:</strong> {teammate.role}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Projects:</strong> {teammate.projects.join(', ')}
            </Typography>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                size="small" 
                variant="outlined" 
                startIcon={<VisibilityIcon />} 
                sx={{ mr: 1 }}
                onClick={() => viewProfile(teammate.id)}
              >
                View Profile
              </Button>
              <Button 
                size="small" 
                variant="contained" 
                startIcon={<MessageIcon />}
                onClick={() => handleMessageOpen(teammate)}
              >
                Message
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
  
  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <PeopleAltIcon sx={{ fontSize: 30, mr: 1, color: 'primary.main' }} />
        <Typography variant="h5" component="h1" fontWeight="bold">
          My Teammates
        </Typography>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search teammates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <IconButton onClick={handleFilterClick}>
            <FilterIcon />
          </IconButton>
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
          >
            <MenuItem onClick={handleFilterClose}>All Teammates</MenuItem>
            <MenuItem onClick={handleFilterClose}>Online Only</MenuItem>
            <MenuItem onClick={handleFilterClose}>By Project</MenuItem>
            <MenuItem onClick={handleFilterClose}>By Skill</MenuItem>
          </Menu>
          
          <IconButton onClick={handleSortClick}>
            <SortIcon />
          </IconButton>
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={handleSortClose}
          >
            <MenuItem onClick={handleSortClose}>Name (A-Z)</MenuItem>
            <MenuItem onClick={handleSortClose}>Recently Active</MenuItem>
            <MenuItem onClick={handleSortClose}>Role</MenuItem>
          </Menu>
        </Box>
      </Paper>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="teammate tabs">
          <Tab label="All Teammates" />
          <Tab label="Frequent Collaborators" />
          <Tab label="Team Leads" />
        </Tabs>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredTeammates.length > 0 ? (
        filteredTeammates.map(renderTeammateCard)
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No teammates found matching your criteria
          </Typography>
        </Box>
      )}
      
      {/* Messaging Dialog */}
      <Dialog 
        open={messageDialogOpen} 
        onClose={handleMessageClose}
        maxWidth="sm"
        fullWidth
      >
        {selectedTeammate && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              alignItems: 'center',
              borderBottom: 1,
              borderColor: 'divider'
            }}>
              <Avatar 
                src={selectedTeammate.avatar} 
                alt={selectedTeammate.name} 
                sx={{ mr: 2 }}
              />
              <Box>
                <Typography variant="h6">{selectedTeammate.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedTeammate.isOnline ? 'Online now' : `Last seen: ${selectedTeammate.lastActive}`}
                </Typography>
              </Box>
              <IconButton 
                sx={{ ml: 'auto' }} 
                onClick={handleMessageClose}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ 
                height: 300, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'text.secondary'
              }}>
                <MessageIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 }} />
                <Typography variant="body1">
                  Start a conversation with {selectedTeammate.name}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        color="primary" 
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                      >
                        <SendIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Teammates; 