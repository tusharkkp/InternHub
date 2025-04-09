import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Link,
  Chip,
  InputAdornment,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import HelpIcon from '@mui/icons-material/Help';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import EmailIcon from '@mui/icons-material/Email';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import ForumIcon from '@mui/icons-material/Forum';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import SendIcon from '@mui/icons-material/Send';
import PhoneIcon from '@mui/icons-material/Phone';
import ChatIcon from '@mui/icons-material/Chat';
import ClearIcon from '@mui/icons-material/Clear';

const FAQS = [
  {
    question: 'How do I apply for an internship?',
    answer: 'To apply for an internship, navigate to the Internships page, browse the available opportunities, and click on "Apply" for the internship you are interested in. Fill out the application form, attach your resume and cover letter, and submit your application. You can track the status of your applications in your Profile dashboard.'
  },
  {
    question: 'How can I create a new project?',
    answer: 'To create a new project, go to the Projects page and click on "Create New Project". Fill out the project details including title, description, required skills, and any other relevant information. Once created, you can invite other users to join your project team and collaborate together.'
  },
  {
    question: 'How do I update my profile and resume?',
    answer: 'To update your profile information and resume, navigate to the Profile page. Click on the "Edit" button in each section to modify your personal information, education details, work experience, skills, and other profile components. You can also upload a new resume or modify your existing one from the Profile page.'
  },
  {
    question: 'Can I participate in multiple projects simultaneously?',
    answer: 'Yes, you can join and participate in multiple projects at the same time. There is no limit to the number of projects you can be involved in. However, make sure you can commit adequate time and resources to each project you join to ensure productive contributions.'
  },
  {
    question: 'How do I connect with other users on the platform?',
    answer: 'You can connect with other users by engaging in the Discussion Forum, collaborating on Projects, or directly messaging them if you find their profile interesting. Active participation in discussions and projects increases your visibility in the community and helps you build your professional network.'
  },
  {
    question: 'What should I do if I forget my password?',
    answer: 'If you forget your password, click on the "Forgot Password" link on the login page. Enter your registered email address, and we will send you a password reset link. Follow the instructions in the email to create a new password and regain access to your account.'
  },
  {
    question: 'How can I report inappropriate content or behavior?',
    answer: 'To report inappropriate content or behavior, use the "Report" option available on posts, comments, projects, or user profiles. Provide detailed information about the issue, and our moderation team will review it promptly. We take all reports seriously and maintain your privacy throughout the process.'
  },
  {
    question: 'Can I get a certificate for completing an internship through the platform?',
    answer: 'Yes, upon successful completion of an internship, you may receive a certificate if the internship provider offers one. The specifics depend on the internship provider\'s policies. You can check the internship details or contact the provider directly to inquire about certification options.'
  }
];

const HELP_CATEGORIES = [
  {
    title: 'Getting Started',
    icon: <PlayCircleOutlineIcon />,
    topics: [
      'Creating Your Account', 
      'Setting Up Your Profile', 
      'Navigating the Platform',
      'Account Verification'
    ]
  },
  {
    title: 'Internships',
    icon: <WorkIcon />,
    topics: [
      'Finding Internships', 
      'Application Process', 
      'Communication with Employers',
      'Internship Reviews'
    ]
  },
  {
    title: 'Projects',
    icon: <DescriptionIcon />,
    topics: [
      'Creating Projects', 
      'Managing Project Teams', 
      'Collaboration Tools',
      'Project Showcase'
    ]
  },
  {
    title: 'Forum & Discussions',
    icon: <ForumIcon />,
    topics: [
      'Starting Discussions', 
      'Community Guidelines', 
      'Topic Categories',
      'Engaging Effectively'
    ]
  },
  {
    title: 'Account & Privacy',
    icon: <AccountCircleIcon />,
    topics: [
      'Privacy Settings', 
      'Account Security', 
      'Data Management',
      'Deactivation Process'
    ]
  },
  {
    title: 'Learning Resources',
    icon: <MenuBookIcon />,
    topics: [
      'Skill Development', 
      'Tutorial Access', 
      'Learning Paths',
      'Certification Options'
    ]
  }
];

const CONTACT_METHODS = [
  {
    method: 'Email Support',
    description: 'Get help via email. Our team typically responds within 24 hours.',
    icon: <EmailIcon fontSize="large" />,
    action: 'support@internshiphub.com',
    buttonText: 'Send Email'
  },
  {
    method: 'Live Chat',
    description: 'Chat with our support team in real-time during business hours.',
    icon: <ChatIcon fontSize="large" />,
    action: '#',
    buttonText: 'Start Chat'
  },
  {
    method: 'Phone Support',
    description: 'Call us directly for urgent issues. Available Mon-Fri 9am-5pm EST.',
    icon: <PhoneIcon fontSize="large" />,
    action: '+1 (800) 123-4567',
    buttonText: 'Call Now'
  }
];

const RESOURCES = [
  {
    title: 'User Guide',
    description: 'Comprehensive guide to using all features of the platform',
    icon: <MenuBookIcon />,
    link: '#',
    tags: ['Guide', 'Tutorial']
  },
  {
    title: 'Video Tutorials',
    description: 'Step-by-step video guides for common tasks',
    icon: <PlayCircleOutlineIcon />,
    link: '#',
    tags: ['Video', 'Tutorial']
  },
  {
    title: 'Career Resources',
    description: 'Tips and resources for career development',
    icon: <SchoolIcon />,
    link: '#',
    tags: ['Career', 'Development']
  },
  {
    title: 'API Documentation',
    description: 'Technical documentation for developers',
    icon: <DescriptionIcon />,
    link: '#',
    tags: ['Technical', 'API']
  }
];

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState(FAQS);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.length === 0) {
      setFilteredFaqs(FAQS);
    } else {
      const filtered = FAQS.filter(
        faq => 
          faq.question.toLowerCase().includes(query) || 
          faq.answer.toLowerCase().includes(query)
      );
      setFilteredFaqs(filtered);
    }
  };
  
  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredFaqs(FAQS);
  };
  
  const handleContactChange = (event) => {
    const { name, value } = event.target;
    setContactForm({
      ...contactForm,
      [name]: value
    });
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!contactForm.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!contactForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!contactForm.subject.trim()) {
      errors.subject = 'Subject is required';
    }
    
    if (!contactForm.message.trim()) {
      errors.message = 'Message is required';
    } else if (contactForm.message.length < 20) {
      errors.message = 'Message should be at least 20 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleContactSubmit = (event) => {
    event.preventDefault();
    
    if (validateForm()) {
      // Here you would send the form data to your backend
      console.log('Form submitted:', contactForm);
      
      // Show success message
      setSnackbarMessage('Your message has been sent! We will get back to you soon.');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      // Clear form
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } else {
      setSnackbarMessage('Please correct the errors in the form.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Help & Support
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Find answers to common questions or get in touch with our support team
      </Typography>
      
      <Box sx={{ mb: 5 }}>
        <TextField
          fullWidth
          placeholder="Search for help topics, FAQs, or keywords..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  onClick={handleClearSearch}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ) : null,
            sx: { borderRadius: 2, py: 0.5 }
          }}
          sx={{ mb: 2 }}
        />
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <HelpIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" component="h2">
                Frequently Asked Questions
              </Typography>
            </Box>
            
            {filteredFaqs.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No results found for "{searchQuery}".
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try using different keywords or browse our help categories below.
                </Typography>
              </Box>
            ) : (
              filteredFaqs.map((faq, index) => (
                <Accordion key={index} sx={{ mb: 1 }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`faq-panel-${index}-content`}
                    id={`faq-panel-${index}-header`}
                  >
                    <Typography variant="subtitle1" fontWeight="medium">
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body1">
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))
            )}
          </Paper>
          
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <LiveHelpIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" component="h2">
                Help Categories
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              {HELP_CATEGORIES.map((category, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%',
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: 3,
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ color: 'primary.main', mr: 1 }}>
                          {category.icon}
                        </Box>
                        <Typography variant="h6" component="h3">
                          {category.title}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <List dense disablePadding>
                        {category.topics.map((topic, topicIndex) => (
                          <ListItem key={topicIndex} disablePadding disableGutters sx={{ py: 0.5 }}>
                            <ListItemText 
                              primary={
                                <Link 
                                  href="#" 
                                  underline="hover" 
                                  color="inherit"
                                  sx={{ display: 'block' }}
                                >
                                  {topic}
                                </Link>
                              } 
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <MenuBookIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" component="h2">
                Resources & Documentation
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              {RESOURCES.map((resource, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: 3,
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ color: 'primary.main', mr: 1 }}>
                          {resource.icon}
                        </Box>
                        <Typography variant="h6" component="h3">
                          {resource.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {resource.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          {resource.tags.map((tag, tagIndex) => (
                            <Chip 
                              key={tagIndex}
                              label={tag}
                              size="small"
                              sx={{ mr: 0.5 }}
                            />
                          ))}
                        </Box>
                        <Button
                          component={Link}
                          href={resource.link}
                          variant="outlined"
                          size="small"
                        >
                          View
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ContactSupportIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h5" component="h2">
                Contact Us
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Can't find what you're looking for? Get in touch with our support team.
            </Typography>
            
            <form onSubmit={handleContactSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    variant="outlined"
                    error={Boolean(formErrors.name)}
                    helperText={formErrors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    variant="outlined"
                    error={Boolean(formErrors.email)}
                    helperText={formErrors.email}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleContactChange}
                    variant="outlined"
                    error={Boolean(formErrors.subject)}
                    helperText={formErrors.subject}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    variant="outlined"
                    multiline
                    rows={4}
                    error={Boolean(formErrors.message)}
                    helperText={formErrors.message}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    endIcon={<SendIcon />}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Other Ways to Get Help
            </Typography>
            
            <List>
              {CONTACT_METHODS.map((method, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <ListItemIcon sx={{ mt: 0 }}>
                      {method.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={method.method}
                      secondary={
                        <Box>
                          <Typography 
                            variant="body2" 
                            color="text.primary" 
                            component="span"
                          >
                            {method.description}
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={method.icon}
                              href={method.method === 'Email Support' ? `mailto:${method.action}` : '#'}
                            >
                              {method.buttonText}
                            </Button>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < CONTACT_METHODS.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Help; 