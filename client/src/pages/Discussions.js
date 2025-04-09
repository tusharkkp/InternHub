import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  TextField,
  Button,
  Card,
  CardContent,
  CardActionArea,
  CardActions,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Snackbar,
  Alert,
  useMediaQuery,
  InputAdornment,
  Badge,
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';

// Icons
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MessageIcon from '@mui/icons-material/Message';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import PsychologyIcon from '@mui/icons-material/Psychology';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import EngineeringIcon from '@mui/icons-material/Engineering';
import DevicesIcon from '@mui/icons-material/Devices';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';

// Styled components
const TopicCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)',
  },
  display: 'flex',
  flexDirection: 'column',
}));

const TopicCardContent = styled(CardContent)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: '24px 16px',
});

const TopicIcon = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  width: '60px',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  background: `linear-gradient(145deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
  color: theme.palette.primary.contrastText,
  '& svg': {
    fontSize: '2.5rem',
  },
}));

const ChatContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '500px',
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
}));

const MessagesList = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.02)',
}));

const MessageBubble = styled(Box)(({ theme, isCurrentUser }) => ({
  backgroundColor: isCurrentUser ? theme.palette.primary.main : theme.palette.background.paper,
  color: isCurrentUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  padding: theme.spacing(1.5, 2),
  borderRadius: '18px',
  maxWidth: '70%',
  alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  wordBreak: 'break-word',
}));

const MessageInputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  gap: theme.spacing(1),
}));

// Sample topic categories with their respective icons
const topicCategories = [
  { id: 'react', title: 'React Discussion', icon: <CodeIcon />, description: 'Share tips, ask questions and discuss React development', messageCount: 156 },
  { id: 'ai', title: 'AI & ML', icon: <PsychologyIcon />, description: 'Artificial Intelligence and Machine Learning topics', messageCount: 132 },
  { id: 'internships', title: 'Internship Experiences', icon: <WorkIcon />, description: 'Share your internship experiences and insights', messageCount: 98 },
  { id: 'webdev', title: 'Web Development', icon: <DevicesIcon />, description: 'Front-end, back-end, and full-stack web development', messageCount: 211 },
  { id: 'career', title: 'Career Advice', icon: <SchoolIcon />, description: 'Career guidance, resume tips, and interview preparation', messageCount: 178 },
  { id: 'ui-ux', title: 'UI/UX Design', icon: <DesignServicesIcon />, description: 'User interface and user experience design discussions', messageCount: 87 },
  { id: 'projects', title: 'Project Showcase', icon: <EngineeringIcon />, description: 'Share your projects and get feedback', messageCount: 124 },
  { id: 'help', title: 'Help & Support', icon: <LiveHelpIcon />, description: 'Get help with coding problems and technical issues', messageCount: 203 },
];

// Sample messages for chat rooms
const sampleMessages = {
  'react': [
    { id: 1, user: { id: 'user1', name: 'Alex Johnson', avatar: '/avatars/alex.jpg' }, content: 'Has anyone tried the new React 18 features?', timestamp: '2023-10-15T10:30:00Z' },
    { id: 2, user: { id: 'user2', name: 'Sarah Chen', avatar: '/avatars/sarah.jpg' }, content: 'Yes! The automatic batching is really improving performance in my app.', timestamp: '2023-10-15T10:32:00Z' },
    { id: 3, user: { id: 'user3', name: 'Michael Brown', avatar: '/avatars/michael.jpg' }, content: 'I\'m still having some issues with Suspense and data fetching. Any tips?', timestamp: '2023-10-15T10:35:00Z' },
    { id: 4, user: { id: 'user1', name: 'Alex Johnson', avatar: '/avatars/alex.jpg' }, content: 'Try using a library like react-query or SWR for data fetching - they work well with Suspense.', timestamp: '2023-10-15T10:37:00Z' },
  ],
  'ai': [
    { id: 1, user: { id: 'user4', name: 'Emily Wilson', avatar: '/avatars/emily.jpg' }, content: 'What ML frameworks are you all using these days?', timestamp: '2023-10-16T14:20:00Z' },
    { id: 2, user: { id: 'user5', name: 'David Thompson', avatar: '/avatars/david.jpg' }, content: 'PyTorch has been my go-to for research work, but TensorFlow is better integrated with production systems in my experience.', timestamp: '2023-10-16T14:22:00Z' },
    { id: 3, user: { id: 'user6', name: 'Julia Martinez', avatar: '/avatars/julia.jpg' }, content: 'Has anyone experimented with JAX? I\'m curious about its performance benefits.', timestamp: '2023-10-16T14:25:00Z' },
  ],
  'internships': [
    { id: 1, user: { id: 'user7', name: 'Ryan Lee', avatar: '/avatars/ryan.jpg' }, content: 'Just finished my summer internship at a startup. It was an amazing experience!', timestamp: '2023-10-14T09:15:00Z' },
    { id: 2, user: { id: 'user8', name: 'Priya Patel', avatar: '/avatars/priya.jpg' }, content: 'What did you work on? I\'m applying for internships now and trying to get a sense of what to expect.', timestamp: '2023-10-14T09:17:00Z' },
    { id: 3, user: { id: 'user7', name: 'Ryan Lee', avatar: '/avatars/ryan.jpg' }, content: 'I was on the front-end team, building new features with React. The best part was having real ownership of features that went to production!', timestamp: '2023-10-14T09:20:00Z' },
  ],
  // Add more sample messages for other topics as needed
};

// Main component
const Discussions = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id: topicId } = useParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  
  // Get current user from Redux state
  const { user, isAuthenticated } = useSelector(state => state.auth);
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [newTopicDialog, setNewTopicDialog] = useState(false);
  const [newTopicData, setNewTopicData] = useState({
    title: '',
    description: ''
  });

  // Initialize selectedTopic if a topicId is provided in the URL
  useEffect(() => {
    if (topicId) {
      const topic = topicCategories.find(t => t.id === topicId);
      if (topic) {
        handleTopicSelect(topic);
      }
    }
  }, [topicId]);

  // Load messages when a topic is selected
  useEffect(() => {
    if (selectedTopic) {
      setLoading(true);
      // Simulate API call to get messages
      setTimeout(() => {
        setMessages(sampleMessages[selectedTopic.id] || []);
        setLoading(false);
        // Update URL
        navigate(`/discussions/${selectedTopic.id}`, { replace: true });
      }, 1000);
    }
  }, [selectedTopic, navigate]);

  // Handle topic selection
  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
  };

  // Filter topics based on search term
  const filteredTopics = topicCategories.filter(topic => 
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: messages.length + 1,
      user: {
        id: user?.id || 'currentUser',
        name: user?.name || 'You',
        avatar: user?.avatar || '/avatars/default.jpg'
      },
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate successful message sending
    setSnackbar({
      open: true,
      message: 'Message sent successfully',
      severity: 'success'
    });
    
    // Auto-scroll to bottom of chat
    setTimeout(() => {
      const messagesContainer = document.getElementById('messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 100);
  };

  // Handle creating a new topic
  const handleCreateTopic = () => {
    // Validate inputs
    if (newTopicData.title.trim() === '' || newTopicData.description.trim() === '') {
      setSnackbar({
        open: true,
        message: 'Please fill in all fields',
        severity: 'error'
      });
      return;
    }
    
    // Simulate creating a new topic
    setSnackbar({
      open: true,
      message: 'Topic created successfully',
      severity: 'success'
    });
    
    setNewTopicDialog(false);
    setNewTopicData({ title: '', description: '' });
    
    // In a real app, you would dispatch an action to create the topic in the backend
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle message input with Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 5 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Discussions
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Join topic-based discussion rooms to connect with the community, share knowledge, and ask questions.
        </Typography>
        <Divider sx={{ mt: 2, mb: 4 }} />
      </Box>
      
      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Side - Topic Selection */}
        <Grid item xs={12} md={selectedTopic ? 4 : 12}>
          {/* Search and Create Topic */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: theme.palette.background.paper }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setNewTopicDialog(true)}
              sx={{ whiteSpace: 'nowrap' }}
            >
              New Topic
            </Button>
          </Box>
          
          {/* Topics Grid */}
          {!selectedTopic || !isMobile ? (
            <Grid container spacing={2}>
              {filteredTopics.map((topic) => (
                <Grid item xs={12} sm={6} md={selectedTopic ? 12 : 3} key={topic.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TopicCard>
                      <CardActionArea onClick={() => handleTopicSelect(topic)}>
                        <TopicCardContent>
                          <TopicIcon>
                            {topic.icon}
                          </TopicIcon>
                          <Typography variant="h6" component="h2" gutterBottom>
                            {topic.title}
                          </Typography>
                          {(!selectedTopic || !isMobile) && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {topic.description}
                            </Typography>
                          )}
                          <Chip
                            label={`${topic.messageCount} messages`}
                            size="small"
                            icon={<MessageIcon fontSize="small" />}
                            sx={{ mt: 'auto' }}
                          />
                        </TopicCardContent>
                      </CardActionArea>
                    </TopicCard>
                  </motion.div>
                </Grid>
              ))}
              {filteredTopics.length === 0 && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="body1">
                      No topics found matching your search.
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          ) : null}
        </Grid>
        
        {/* Right Side - Chat Room */}
        {selectedTopic && (
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
              {/* Chat Room Header */}
              <Box 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  backgroundColor: theme.palette.background.paper
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      width: 40, 
                      height: 40, 
                      borderRadius: '50%', 
                      backgroundColor: theme.palette.primary.main, 
                      color: theme.palette.primary.contrastText 
                    }}
                  >
                    {selectedTopic.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6">
                      {selectedTopic.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedTopic.messageCount} messages
                    </Typography>
                  </Box>
                </Box>
                {isMobile && (
                  <IconButton onClick={() => setSelectedTopic(null)}>
                    <CloseIcon />
                  </IconButton>
                )}
              </Box>
              
              {/* Chat Messages */}
              <ChatContainer>
                <MessagesList id="messages-container">
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <CircularProgress />
                    </Box>
                  ) : messages.length > 0 ? (
                    messages.map((message) => (
                      <Box key={message.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: message.user.id === (user?.id || 'currentUser') ? 'flex-end' : 'flex-start' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, order: message.user.id === (user?.id || 'currentUser') ? 1 : 0 }}>
                          {message.user.id !== (user?.id || 'currentUser') && (
                            <Avatar 
                              src={message.user.avatar}
                              alt={message.user.name}
                              sx={{ width: 24, height: 24, mr: 1 }}
                            >
                              {message.user.name.charAt(0)}
                            </Avatar>
                          )}
                          <Typography variant="caption" color="text.secondary">
                            {message.user.id === (user?.id || 'currentUser') ? 'You' : message.user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            {formatTimestamp(message.timestamp)}
                          </Typography>
                        </Box>
                        <MessageBubble isCurrentUser={message.user.id === (user?.id || 'currentUser')}>
                          <Typography variant="body1">
                            {message.content}
                          </Typography>
                        </MessageBubble>
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <Typography variant="body1" color="text.secondary">
                        No messages yet. Be the first to start the conversation!
                      </Typography>
                    </Box>
                  )}
                </MessagesList>
                
                {/* Message Input */}
                <MessageInputContainer>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    placeholder="Type a message..."
                    variant="outlined"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '24px',
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={handleSendMessage}
                    disabled={newMessage.trim() === ''}
                    sx={{ borderRadius: '24px', px: 3 }}
                  >
                    Send
                  </Button>
                </MessageInputContainer>
              </ChatContainer>
            </Paper>
          </Grid>
        )}
      </Grid>
      
      {/* New Topic Dialog */}
      <Dialog open={newTopicDialog} onClose={() => setNewTopicDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Discussion Topic</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Create a new topic for discussion. Be specific about the subject to attract relevant participants.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Topic Title"
            fullWidth
            variant="outlined"
            value={newTopicData.title}
            onChange={(e) => setNewTopicData({ ...newTopicData, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newTopicData.description}
            onChange={(e) => setNewTopicData({ ...newTopicData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewTopicDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateTopic} variant="contained">Create Topic</Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Discussions; 