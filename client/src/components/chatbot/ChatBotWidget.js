import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Fab,
  Zoom,
  CircularProgress,
  Chip
} from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { toggleChatbot, sendMessage, clearMessages, addMessage } from '../../store/slices/chatbotSlice';

// Styled components
const ChatContainer = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 80,
  right: 20,
  width: 350,
  height: 500,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: theme.shadows[10],
  zIndex: 1100,
  [theme.breakpoints.down('sm')]: {
    width: 'calc(100% - 40px)',
    height: 400,
  },
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const ChatMessages = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  overflowY: 'auto',
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#f5f5f5',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

const MessageBubble = styled(Box)(({ theme, isUser }) => ({
  maxWidth: '70%',
  padding: theme.spacing(1.5, 2),
  borderRadius: isUser
    ? `${theme.shape.borderRadius * 2}px ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px ${theme.shape.borderRadius * 2}px`
    : `${theme.shape.borderRadius}px ${theme.shape.borderRadius * 2}px ${theme.shape.borderRadius * 2}px ${theme.shape.borderRadius}px`,
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  boxShadow: theme.shadows[1],
  wordWrap: 'break-word',
}));

const ChatInputWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const ChatFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 20,
  right: 20,
  zIndex: 1100,
  boxShadow: theme.shadows[5],
}));

const ChatBotWidget = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isOpen, messages, loading } = useSelector((state) => state.chatbot);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const timer = setTimeout(() => {
        dispatch(addMessage({
          id: Date.now().toString(),
          text: "Welcome to Intern Hub Assistant! I can help you with:\n\n• Finding internships and projects\n• Navigating the platform features\n• Applying to opportunities\n• Managing your profile\n• Using AI matching for teammates\n• Tracking your career progress\n\nHow can I assist you today?",
          sender: 'bot',
          timestamp: new Date().toISOString()
        }));
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length, dispatch]);

  const handleToggle = () => {
    dispatch(toggleChatbot());
  };

  const handleSend = () => {
    if (input.trim() === '') return;
    
    dispatch(sendMessage(input));
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const renderSuggestionPills = () => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2, mt: messages.length ? 2 : 0 }}>
      <Chip 
        label="How to apply?" 
        size="small" 
        onClick={() => dispatch(sendMessage("How do I apply for an internship?"))}
        sx={{ 
          cursor: 'pointer',
          '&:hover': { backgroundColor: theme.palette.primary.light, color: 'white' }
        }} 
      />
      <Chip 
        label="Find projects" 
        size="small" 
        onClick={() => dispatch(sendMessage("How can I find projects to join?"))}
        sx={{ 
          cursor: 'pointer',
          '&:hover': { backgroundColor: theme.palette.primary.light, color: 'white' }
        }} 
      />
      <Chip 
        label="Track applications" 
        size="small" 
        onClick={() => dispatch(sendMessage("Where can I track my applications?"))}
        sx={{ 
          cursor: 'pointer',
          '&:hover': { backgroundColor: theme.palette.primary.light, color: 'white' }
        }} 
      />
      <Chip 
        label="AI matching" 
        size="small" 
        onClick={() => dispatch(sendMessage("How does the AI teammate matching work?"))}
        sx={{ 
          cursor: 'pointer',
          '&:hover': { backgroundColor: theme.palette.primary.light, color: 'white' }
        }} 
      />
    </Box>
  );

  return (
    <>
      {isOpen && (
        <Zoom in={isOpen}>
          <ChatContainer>
            <ChatHeader>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.dark', mr: 1 }}>
                  <SmartToyIcon />
                </Avatar>
                <Typography variant="h6">Intern Hub Assistant</Typography>
              </Box>
              <IconButton onClick={handleToggle} size="small" sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </ChatHeader>
            
            <ChatMessages>
              {messages.length === 0 ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                  <SmartToyIcon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                  <Typography variant="body1" align="center" color="text.secondary" sx={{ maxWidth: '80%', mb: 3 }}>
                    Welcome to Intern Hub! I'm here to help you navigate the platform and find the best opportunities.
                  </Typography>
                  {renderSuggestionPills()}
                </Box>
              ) : (
                <>
                  {messages.map((msg) => (
                    <Box key={msg.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                      <MessageBubble isUser={msg.sender === 'user'}>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{msg.text}</Typography>
                      </MessageBubble>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                        {formatTime(msg.timestamp)}
                      </Typography>
                    </Box>
                  ))}
                  {messages.length > 0 && messages[messages.length - 1].sender === 'bot' && renderSuggestionPills()}
                </>
              )}
              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              )}
            </ChatMessages>
            
            <ChatInputWrapper>
              <TextField
                fullWidth
                placeholder="Ask me anything about Intern Hub..."
                variant="outlined"
                size="small"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{ mr: 1 }}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={loading || input.trim() === ''}
              >
                <SendIcon />
              </IconButton>
            </ChatInputWrapper>
          </ChatContainer>
        </Zoom>
      )}
      
      <ChatFab color="primary" onClick={handleToggle} aria-label="chatbot">
        <SmartToyIcon />
      </ChatFab>
    </>
  );
};

export default ChatBotWidget; 