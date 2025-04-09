import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions, 
  Avatar, 
  Button, 
  Chip, 
  Divider, 
  TextField, 
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Badge,
  LinearProgress,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Message as MessageIcon,
  PersonAdd as PersonAddIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Circle as CircleIcon
} from '@mui/icons-material';

// Mock data for teammates
const mockTeammates = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    title: "Frontend Developer",
    bio: "Passionate about React and UI/UX design. Currently working on e-commerce projects.",
    skills: ["React", "JavaScript", "CSS", "UI/UX"],
    projects: ["E-commerce Platform", "Portfolio Website"],
    internships: ["Google Summer Internship", "Local Web Agency"],
    role: "Team Lead",
    isOnline: true,
    lastActive: "Just now"
  },
  {
    id: 2,
    name: "Samantha Lee",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    title: "Backend Developer",
    bio: "Specializing in Node.js and database design. Love solving complex problems.",
    skills: ["Node.js", "Express", "MongoDB", "SQL"],
    projects: ["API Development", "Database Migration"],
    internships: ["Amazon Web Services"],
    role: "Developer",
    isOnline: false,
    lastActive: "3 hours ago"
  },
  {
    id: 3,
    name: "Michael Chen",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    title: "Full Stack Developer",
    bio: "Full stack developer with experience in MERN stack. Currently exploring AI applications.",
    skills: ["React", "Node.js", "MongoDB", "Express", "Python"],
    projects: ["AI Chat Application", "Task Management System"],
    internships: ["Microsoft Student Partner"],
    role: "Developer",
    isOnline: true,
    lastActive: "Just now"
  },
  {
    id: 4,
    name: "Emma Wilson",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    title: "UX Designer",
    bio: "Passionate about creating user-friendly and accessible designs. Working on mobile app designs.",
    skills: ["Figma", "Adobe XD", "Sketch", "UI/UX Research"],
    projects: ["Mobile Banking App", "Health Tracker UI"],
    internships: ["Facebook Design Intern"],
    role: "Designer",
    isOnline: false,
    lastActive: "1 day ago"
  },
  {
    id: 5,
    name: "James Rodriguez",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
    title: "DevOps Engineer",
    bio: "Focused on CI/CD pipelines and infrastructure automation. Linux enthusiast.",
    skills: ["Docker", "Kubernetes", "AWS", "Jenkins", "Linux"],
    projects: ["Deployment Automation", "Cloud Migration"],
    internships: ["IBM Cloud Internship"],
    role: "Operations",
    isOnline: true,
    lastActive: "30 minutes ago"
  },
  {
    id: 6,
    name: "Olivia Baker",
    avatar: "https://randomuser.me/api/portraits/women/29.jpg",
    title: "Mobile Developer",
    bio: "Experienced in native and cross-platform mobile development. Currently working on Flutter projects.",
    skills: ["Flutter", "React Native", "iOS", "Android"],
    projects: ["Fitness App", "Food Delivery App"],
    internships: ["Apple Developer Academy"],
    role: "Developer",
    isOnline: false,
    lastActive: "2 days ago"
  }
];

const Teammates = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTeammates, setFilteredTeammates] = useState(mockTeammates);
  const [loading, setLoading] = useState(false);
  const [filterBy, setFilterBy] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [tabValue, setTabValue] = useState(0);
  
  // Dialog state
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedTeammate, setSelectedTeammate] = useState(null);
  const [messageText, setMessageText] = useState('');
  
  // Added: State for more info dialog
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  
  // Added: State for chat history
  const [chatHistory, setChatHistory] = useState({});
  
  // Filter teammates based on search query
  useEffect(() => {
    setLoading(true);
    // Simulate API call delay
    const timeoutId = setTimeout(() => {
      const filtered = mockTeammates.filter(teammate => {
        const matchesSearch = teammate.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            teammate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            teammate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
        
        if (filterBy === 'all') {
          return matchesSearch;
        } else if (filterBy === 'online') {
          return matchesSearch && teammate.isOnline;
        } else if (filterBy === 'developers') {
          return matchesSearch && teammate.role === 'Developer';
        } else if (filterBy === 'designers') {
          return matchesSearch && teammate.role === 'Designer';
        }
        return matchesSearch;
      });
      
      // Sort teammates
      const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        } else if (sortBy === 'recent') {
          return a.lastActive === 'Just now' ? -1 : 1;
        } else if (sortBy === 'role') {
          return a.role.localeCompare(b.role);
        }
        return 0;
      });
      
      setFilteredTeammates(sorted);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, filterBy, sortBy]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      setFilterBy('all');
    } else if (newValue === 1) {
      setFilterBy('online');
    } else if (newValue === 2) {
      setFilterBy('developers');
    } else if (newValue === 3) {
      setFilterBy('designers');
    }
  };
  
  const handleMessageClick = (teammate) => {
    setSelectedTeammate(teammate);
    setMessageDialogOpen(true);
    
    // Initialize chat history for this teammate if it doesn't exist
    if (!chatHistory[teammate.id]) {
      setChatHistory(prev => ({
        ...prev,
        [teammate.id]: []
      }));
    }
  };
  
  const handleCloseMessageDialog = () => {
    setMessageDialogOpen(false);
    setMessageText('');
  };
  
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    // Add message to chat history
    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: messageText,
      timestamp: new Date().toISOString()
    };
    
    setChatHistory(prev => ({
      ...prev,
      [selectedTeammate.id]: [...(prev[selectedTeammate.id] || []), newMessage]
    }));
    
    console.log(`Sending message to ${selectedTeammate.name}: ${messageText}`);
    setMessageText('');
    
    // Simulate receiving a response after a short delay
    setTimeout(() => {
      const response = {
        id: Date.now() + 1,
        sender: selectedTeammate.id,
        text: `Thanks for your message! This is an automated response from ${selectedTeammate.name}.`,
        timestamp: new Date().toISOString()
      };
      
      setChatHistory(prev => ({
        ...prev,
        [selectedTeammate.id]: [...(prev[selectedTeammate.id] || []), response]
      }));
    }, 1000);
  };
  
  // Added: Handler for More Info button
  const handleMoreInfoClick = (teammate) => {
    setSelectedTeammate(teammate);
    setInfoDialogOpen(true);
  };
  
  // Added: Handler to close the info dialog
  const handleCloseInfoDialog = () => {
    setInfoDialogOpen(false);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My Teammates
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Connect and collaborate with your team members
        </Typography>
      </Box>
      
      {/* Search and Filter Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 2,
          backgroundColor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(10px)'
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              placeholder="Search teammates by name, skills, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                displayEmpty
                startAdornment={
                  <InputAdornment position="start">
                    <SortIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="name">Sort by Name</MenuItem>
                <MenuItem value="recent">Sort by Recent Activity</MenuItem>
                <MenuItem value="role">Sort by Role</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={4}>
            {/* Removed the "Connect Now" button */}
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Teammates" />
            <Tab label="Online Now" />
            <Tab label="Developers" />
            <Tab label="Designers" />
          </Tabs>
        </Box>
      </Paper>
      
      {/* Teammates listing */}
      {loading ? (
        <LinearProgress sx={{ mb: 2 }} />
      ) : (
        <>
          {filteredTeammates.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="h6" color="text.secondary">
                No teammates found matching your criteria
              </Typography>
              <Button 
                sx={{ mt: 2 }}
                onClick={() => {
                  setSearchQuery('');
                  setFilterBy('all');
                  setSortBy('name');
                  setTabValue(0);
                }}
              >
                Clear filters
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredTeammates.map((teammate) => (
                <Grid item xs={12} sm={6} md={4} key={teammate.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 3,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'flex-start', 
                        p: 2,
                        background: theme.palette.mode === 'dark' 
                          ? 'linear-gradient(145deg, #2c2c2c 0%, #1c1c1c 100%)' 
                          : 'linear-gradient(145deg, #f5f7fa 0%, #e4e6eb 100%)'
                      }}
                    >
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          teammate.isOnline ? (
                            <CircleIcon 
                              sx={{ 
                                color: 'success.main', 
                                fontSize: 12,
                                backgroundColor: theme.palette.background.paper,
                                borderRadius: '50%'
                              }} 
                            />
                          ) : null
                        }
                      >
                        <Avatar 
                          alt={teammate.name}
                          src={teammate.avatar}
                          sx={{ width: 70, height: 70, border: '3px solid #fff' }}
                        />
                      </Badge>
                      <Box sx={{ ml: 2, flexGrow: 1 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {teammate.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {teammate.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Typography variant="caption" color={teammate.isOnline ? 'success.main' : 'text.disabled'} sx={{ display: 'flex', alignItems: 'center' }}>
                            {teammate.isOnline ? 'Online' : `Last active: ${teammate.lastActive}`}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {teammate.bio}
                      </Typography>
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Skills
                        </Typography>
                        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {teammate.skills.slice(0, 4).map((skill, index) => (
                            <Chip 
                              key={index} 
                              label={skill} 
                              size="small" 
                              sx={{ 
                                borderRadius: 1,
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main
                              }} 
                            />
                          ))}
                          {teammate.skills.length > 4 && (
                            <Chip 
                              label={`+${teammate.skills.length - 4}`} 
                              size="small" 
                              sx={{ 
                                borderRadius: 1,
                                backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                                color: theme.palette.secondary.main
                              }} 
                            />
                          )}
                        </Box>
                      </Box>
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Current Activities
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          {teammate.projects.slice(0, 2).map((project, index) => (
                            <Typography key={index} variant="body2" color="text.secondary">
                              • {project}
                            </Typography>
                          ))}
                          {teammate.internships && teammate.internships.slice(0, 1).map((internship, index) => (
                            <Typography key={index} variant="body2" color="text.secondary">
                              • {internship}
                            </Typography>
                          ))}
                        </Box>
                      </Box>
                    </CardContent>
                    
                    <Divider />
                    <CardActions sx={{ px: 2, py: 1, justifyContent: 'space-between' }}>
                      <Button 
                        size="small"
                        onClick={() => handleMoreInfoClick(teammate)}
                        sx={{ 
                          borderRadius: 1.5,
                          textTransform: 'none'
                        }}
                      >
                        More Info
                      </Button>
                      <Button
                        startIcon={<MessageIcon />}
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleMessageClick(teammate)}
                        sx={{ 
                          borderRadius: 1.5,
                          textTransform: 'none'
                        }}
                      >
                        Message
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
      
      {/* Message Dialog */}
      <Dialog 
        open={messageDialogOpen} 
        onClose={handleCloseMessageDialog}
        PaperProps={{
          sx: { borderRadius: 3, maxWidth: 500 }
        }}
        fullWidth
      >
        {selectedTeammate && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      selectedTeammate.isOnline ? (
                        <CircleIcon 
                          sx={{ 
                            color: 'success.main', 
                            fontSize: 12,
                            backgroundColor: theme.palette.background.paper,
                            borderRadius: '50%'
                          }} 
                        />
                      ) : null
                    }
                  >
                    <Avatar 
                      alt={selectedTeammate.name}
                      src={selectedTeammate.avatar}
                      sx={{ width: 40, height: 40 }}
                    />
                  </Badge>
                  <Box sx={{ ml: 1.5 }}>
                    <Typography variant="h6">{selectedTeammate.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedTeammate.isOnline ? 'Online now' : `Last active: ${selectedTeammate.lastActive}`}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={handleCloseMessageDialog} size="small">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent>
              {/* Updated: Display chat history */}
              <Box sx={{ height: 250, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1, p: 1 }}>
                {chatHistory[selectedTeammate.id]?.length > 0 ? (
                  chatHistory[selectedTeammate.id].map(message => (
                    <Box 
                      key={message.id}
                      sx={{ 
                        alignSelf: message.sender === 'me' ? 'flex-end' : 'flex-start',
                        backgroundColor: message.sender === 'me' 
                          ? alpha(theme.palette.primary.main, 0.1) 
                          : alpha(theme.palette.grey[500], 0.1),
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        maxWidth: '80%'
                      }}
                    >
                      <Typography variant="body2">{message.text}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography variant="body2" color="text.secondary" align="center">
                      This is the beginning of your conversation with {selectedTeammate.name}.
                      <br />
                      Say hello and start collaborating!
                    </Typography>
                  </Box>
                )}
              </Box>
              <TextField
                autoFocus
                multiline
                rows={3}
                fullWidth
                variant="outlined"
                placeholder="Type your message here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                sx={{ mt: 2 }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={handleCloseMessageDialog}>Cancel</Button>
              <Button 
                onClick={handleSendMessage} 
                variant="contained" 
                disabled={!messageText.trim()} 
                endIcon={<SendIcon />}
                sx={{ borderRadius: 2 }}
              >
                Send
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Added: Info Dialog */}
      <Dialog 
        open={infoDialogOpen} 
        onClose={handleCloseInfoDialog}
        PaperProps={{
          sx: { borderRadius: 3, maxWidth: 500 }
        }}
        fullWidth
      >
        {selectedTeammate && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6">Teammate Details</Typography>
                <IconButton onClick={handleCloseInfoDialog} size="small">
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  alt={selectedTeammate.name}
                  src={selectedTeammate.avatar}
                  sx={{ width: 80, height: 80 }}
                />
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h5" gutterBottom>{selectedTeammate.name}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">{selectedTeammate.title}</Typography>
                  <Typography variant="body2" color={selectedTeammate.isOnline ? 'success.main' : 'text.secondary'}>
                    {selectedTeammate.isOnline ? 'Online now' : `Last active: ${selectedTeammate.lastActive}`}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" paragraph>{selectedTeammate.bio}</Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>Contact Information</Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {selectedTeammate.name.toLowerCase().replace(' ', '.')}@example.com
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>Skills</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selectedTeammate.skills.map((skill, index) => (
                    <Chip 
                      key={index} 
                      label={skill} 
                      size="small" 
                      sx={{ 
                        borderRadius: 1,
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.main,
                        mb: 0.5
                      }} 
                    />
                  ))}
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>Current Projects</Typography>
                {selectedTeammate.projects.map((project, index) => (
                  <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                    • {project}
                  </Typography>
                ))}
              </Box>
              
              {selectedTeammate.internships && selectedTeammate.internships.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>Internships</Typography>
                  {selectedTeammate.internships.map((internship, index) => (
                    <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                      • {internship}
                    </Typography>
                  ))}
                </Box>
              )}
              
              <Box>
                <Typography variant="h6" gutterBottom>Role</Typography>
                <Chip 
                  label={selectedTeammate.role} 
                  color="primary" 
                  variant="outlined"
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button 
                onClick={() => {
                  handleCloseInfoDialog();
                  handleMessageClick(selectedTeammate);
                }} 
                variant="outlined"
                startIcon={<MessageIcon />}
              >
                Send Message
              </Button>
              <Button onClick={handleCloseInfoDialog} variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default Teammates; 