import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Avatar,
  Chip,
  Grid,
  IconButton,
  Divider,
  TextField,
  InputAdornment,
  CircularProgress,
  Container,
  Paper,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Message as MessageIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  GitHub as GitHubIcon,
  Badge as BadgeIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Styled components
const TeammateCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'all 0.3s ease',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  margin: '-50px auto 0',
  position: 'relative',
  zIndex: 2,
}));

const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
}));

const ProjectBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  fontWeight: 'bold',
  position: 'absolute',
  top: 12,
  right: 12,
  zIndex: 2,
}));

const StatusIndicator = styled('div')(({ theme, status }) => {
  let color;
  switch (status) {
    case 'active':
      color = theme.palette.success.main;
      break;
    case 'busy':
      color = theme.palette.warning.main;
      break;
    case 'offline':
      color = theme.palette.grey[400];
      break;
    default:
      color = theme.palette.grey[400];
  }
  
  return {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: color,
    border: `2px solid ${theme.palette.background.paper}`,
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 3,
  };
});

const MessageButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  fontWeight: 600,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
}));

const NoTeammatesBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(5),
  marginTop: theme.spacing(4),
  backgroundColor: 'rgba(0, 0, 0, 0.02)',
  borderRadius: theme.shape.borderRadius,
  border: '1px dashed rgba(0, 0, 0, 0.1)',
}));

// Main component
const TeammateList = () => {
  const [teammates, setTeammates] = useState([]);
  const [filteredTeammates, setFilteredTeammates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedTeammate, setSelectedTeammate] = useState(null);
  const [messageText, setMessageText] = useState('');
  
  // Mock data for development
  const mockTeammates = [
    {
      id: 1,
      name: 'Emily Johnson',
      profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg',
      title: 'Frontend Developer',
      bio: 'Passionate about creating beautiful user interfaces and interactive web applications',
      skills: ['React', 'JavaScript', 'UI/UX Design', 'CSS'],
      status: 'active',
      currentProjects: [
        { id: 101, name: 'E-commerce Platform', role: 'UI Developer' },
        { id: 102, name: 'Task Management App', role: 'Frontend Lead' },
      ],
      currentInternships: [
        { id: 201, company: 'TechStart Inc.', position: 'Frontend Development Intern' },
      ],
      connectionType: 'project',
    },
    {
      id: 2,
      name: 'Alex Rodriguez',
      profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
      title: 'Full Stack Developer',
      bio: 'Building robust applications with modern technologies. Enthusiast of clean code and best practices',
      skills: ['React', 'Node.js', 'MongoDB', 'Express'],
      status: 'busy',
      currentProjects: [
        { id: 103, name: 'Social Media Dashboard', role: 'Backend Developer' },
      ],
      currentInternships: [],
      connectionType: 'internship',
    },
    {
      id: 3,
      name: 'Sarah Chen',
      profilePicture: 'https://randomuser.me/api/portraits/women/66.jpg',
      title: 'UI/UX Designer',
      bio: 'Creating engaging user experiences through thoughtful design. Focused on accessibility and usability',
      skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
      status: 'active',
      currentProjects: [
        { id: 104, name: 'E-commerce Platform', role: 'Lead Designer' },
      ],
      currentInternships: [
        { id: 202, company: 'DesignHub', position: 'UX Design Intern' },
      ],
      connectionType: 'project',
    },
    {
      id: 4,
      name: 'Michael Williams',
      profilePicture: 'https://randomuser.me/api/portraits/men/75.jpg',
      title: 'Backend Developer',
      bio: 'Specialized in building scalable APIs and microservices. Interested in cloud technologies',
      skills: ['Java', 'Spring Boot', 'AWS', 'Docker'],
      status: 'offline',
      currentProjects: [
        { id: 105, name: 'Task Management App', role: 'Backend Lead' },
      ],
      currentInternships: [
        { id: 203, company: 'CloudTech Solutions', position: 'Software Development Intern' },
      ],
      connectionType: 'both',
    },
  ];

  useEffect(() => {
    // In a real app, fetch teammates data from API
    // For now, use mock data
    setTimeout(() => {
      setTeammates(mockTeammates);
      setFilteredTeammates(mockTeammates);
      setLoading(false);
    }, 1000); // Simulate network delay
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTeammates(teammates);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      setFilteredTeammates(
        teammates.filter(teammate => 
          teammate.name.toLowerCase().includes(lowercasedQuery) ||
          teammate.title.toLowerCase().includes(lowercasedQuery) ||
          teammate.bio.toLowerCase().includes(lowercasedQuery) ||
          teammate.skills.some(skill => skill.toLowerCase().includes(lowercasedQuery))
        )
      );
    }
  }, [searchQuery, teammates]);

  const handleMessageOpen = (teammate) => {
    setSelectedTeammate(teammate);
    setMessageDialogOpen(true);
  };

  const handleMessageClose = () => {
    setMessageDialogOpen(false);
    setSelectedTeammate(null);
    setMessageText('');
  };

  const handleSendMessage = () => {
    // In a real app, send message to API
    console.log(`Sending message to ${selectedTeammate.name}: ${messageText}`);
    
    // Close dialog
    handleMessageClose();
    
    // Show success notification (in a real app)
  };

  // Render loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          My Teammates
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Connect and collaborate with team members you're working with on projects and internships
        </Typography>
        
        {/* Search and filter */}
        <Paper sx={{ p: 2, mt: 3, display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Search by name, skills, or role..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mr: 2 }}
          />
          <IconButton color="primary">
            <FilterIcon />
          </IconButton>
        </Paper>
      </Box>

      {filteredTeammates.length > 0 ? (
        <Grid container spacing={3}>
          {filteredTeammates.map((teammate) => (
            <Grid item xs={12} sm={6} md={4} key={teammate.id}>
              <TeammateCard>
                {/* Banner image */}
                <Box
                  sx={{
                    height: 120,
                    backgroundColor: 'primary.main',
                    backgroundImage: 'linear-gradient(135deg, #1976d2, #64b5f6)',
                    position: 'relative',
                  }}
                >
                  <ProjectBadge 
                    label={
                      teammate.connectionType === 'both' 
                        ? 'Project & Internship' 
                        : teammate.connectionType === 'project' 
                          ? 'Project' 
                          : 'Internship'
                    }
                    size="small" 
                  />
                </Box>
                
                {/* Profile picture */}
                <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
                  <ProfileAvatar src={teammate.profilePicture} alt={teammate.name} />
                  <StatusIndicator status={teammate.status} />
                </Box>
                
                <CardContent sx={{ textAlign: 'center', pt: 1 }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {teammate.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary.main" gutterBottom>
                    {teammate.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {teammate.bio}
                  </Typography>
                  
                  {/* Skills */}
                  <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {teammate.skills.slice(0, 3).map((skill, index) => (
                      <SkillChip key={index} label={skill} size="small" />
                    ))}
                    {teammate.skills.length > 3 && (
                      <SkillChip 
                        label={`+${teammate.skills.length - 3} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  {/* Current activities */}
                  <Box sx={{ mb: 2, textAlign: 'left' }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                      Current Activities
                    </Typography>
                    
                    {teammate.currentProjects.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                        <WorkIcon fontSize="small" color="primary" sx={{ mr: 1, mt: 0.3 }} />
                        <Box>
                          <Typography variant="body2" component="div" sx={{ fontWeight: 500 }}>
                            {teammate.currentProjects[0].name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {teammate.currentProjects[0].role}
                            {teammate.currentProjects.length > 1 && ` (+${teammate.currentProjects.length - 1} more projects)`}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                    
                    {teammate.currentInternships.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                        <SchoolIcon fontSize="small" color="primary" sx={{ mr: 1, mt: 0.3 }} />
                        <Box>
                          <Typography variant="body2" component="div" sx={{ fontWeight: 500 }}>
                            {teammate.currentInternships[0].company}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {teammate.currentInternships[0].position}
                            {teammate.currentInternships.length > 1 && ` (+${teammate.currentInternships.length - 1} more internships)`}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                  
                  {/* Action buttons */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                    <Button
                      component={RouterLink}
                      to={`/profile/${teammate.id}`}
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ fontWeight: 500 }}
                    >
                      View Profile
                    </Button>
                    <MessageButton
                      size="small"
                      variant="contained"
                      startIcon={<MessageIcon />}
                      onClick={() => handleMessageOpen(teammate)}
                    >
                      Message
                    </MessageButton>
                  </Box>
                </CardContent>
              </TeammateCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <NoTeammatesBox>
          <PersonIcon color="primary" sx={{ fontSize: 48, mb: 2, opacity: 0.7 }} />
          <Typography variant="h6" gutterBottom>
            No teammates found
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            {searchQuery.trim() !== '' 
              ? "No teammates match your search criteria. Try a different search term."
              : "You haven't connected with any teammates yet. Join projects or internships to connect with teammates."}
          </Typography>
        </NoTeammatesBox>
      )}
      
      {/* Message Dialog */}
      <Dialog 
        open={messageDialogOpen} 
        onClose={handleMessageClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedTeammate && `Message to ${selectedTeammate.name}`}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            multiline
            rows={4}
            label="Your message"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMessageClose}>Cancel</Button>
          <Button 
            onClick={handleSendMessage} 
            variant="contained" 
            disabled={!messageText.trim()}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TeammateList; 