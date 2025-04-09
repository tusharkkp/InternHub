import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider, 
  Switch, 
  FormControlLabel, 
  Slider, 
  Button, 
  Grid, 
  TextField, 
  Stack, 
  Alert, 
  Snackbar, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Tabs,
  Tab
} from '@mui/material';
import { useSelector } from 'react-redux';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TextIncreaseIcon from '@mui/icons-material/TextIncrease';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import ContrastIcon from '@mui/icons-material/Contrast';
import AnimationIcon from '@mui/icons-material/Animation';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import LanguageIcon from '@mui/icons-material/Language';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import SaveIcon from '@mui/icons-material/Save';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  
  const [tabIndex, setTabIndex] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Accessibility Settings
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    largerText: false,
    reducedMotion: false,
    textToSpeech: false,
    keyboardShortcuts: true,
    fontSize: 16,
    contentDensity: 'normal',
    language: 'english'
  });
  
  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    internshipAlerts: true,
    projectInvitations: true,
    forumReplies: true,
    applicationUpdates: true,
    weeklyDigest: true,
    marketingEmails: false
  });
  
  // Account Settings
  const [accountSettings, setAccountSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    showProfileToPublic: true,
    showEmail: false,
    shareActivity: true,
    allowTagging: true,
    showOnlineStatus: true
  });
  
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };
  
  const handleAccessibilityChange = (event) => {
    setAccessibilitySettings({
      ...accessibilitySettings,
      [event.target.name]: event.target.checked
    });
  };
  
  const handleNotificationChange = (event) => {
    setNotificationSettings({
      ...notificationSettings,
      [event.target.name]: event.target.checked
    });
  };
  
  const handlePrivacyChange = (event) => {
    setPrivacySettings({
      ...privacySettings,
      [event.target.name]: event.target.checked
    });
  };
  
  const handleAccountChange = (event) => {
    setAccountSettings({
      ...accountSettings,
      [event.target.name]: event.target.value
    });
  };
  
  const handleFontSizeChange = (event, newValue) => {
    setAccessibilitySettings({
      ...accessibilitySettings,
      fontSize: newValue
    });
  };
  
  const handleContentDensityChange = (event) => {
    setAccessibilitySettings({
      ...accessibilitySettings,
      contentDensity: event.target.value
    });
  };
  
  const handleLanguageChange = (event) => {
    setAccessibilitySettings({
      ...accessibilitySettings,
      language: event.target.value
    });
  };
  
  const saveSettings = (settingType) => {
    // Here you would save the settings to your backend
    setSnackbarMessage(`${settingType} settings saved successfully`);
    setOpenSnackbar(true);
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  
  const renderAccessibilityTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Accessibility Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Customize your experience to make the platform more accessible for your needs.
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Display Options
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={accessibilitySettings.highContrast}
                  onChange={handleAccessibilityChange}
                  name="highContrast"
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ContrastIcon sx={{ mr: 1 }} />
                  High Contrast Mode
                </Box>
              }
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, ml: 7 }}>
              Enhances text visibility with stronger contrast
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={accessibilitySettings.largerText}
                  onChange={handleAccessibilityChange}
                  name="largerText"
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TextIncreaseIcon sx={{ mr: 1 }} />
                  Larger Text
                </Box>
              }
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, ml: 7 }}>
              Increases text size throughout the app
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={accessibilitySettings.reducedMotion}
                  onChange={handleAccessibilityChange}
                  name="reducedMotion"
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AnimationIcon sx={{ mr: 1 }} />
                  Reduced Motion
                </Box>
              }
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, ml: 7 }}>
              Reduces animations and transitions
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={accessibilitySettings.textToSpeech}
                  onChange={handleAccessibilityChange}
                  name="textToSpeech"
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <VolumeUpIcon sx={{ mr: 1 }} />
                  Text-to-Speech
                </Box>
              }
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, ml: 7 }}>
              Enables screen reader compatibility
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={accessibilitySettings.keyboardShortcuts}
                  onChange={handleAccessibilityChange}
                  name="keyboardShortcuts"
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <KeyboardIcon sx={{ mr: 1 }} />
                  Keyboard Shortcuts
                </Box>
              }
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, ml: 7 }}>
              Enable keyboard navigation shortcuts
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom>
            Font Size: {accessibilitySettings.fontSize}px
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2">
              Small
            </Typography>
            <Slider
              value={accessibilitySettings.fontSize}
              onChange={handleFontSizeChange}
              aria-labelledby="font-size-slider"
              valueLabelDisplay="auto"
              step={1}
              marks
              min={12}
              max={24}
              sx={{ mx: 2 }}
            />
            <Typography variant="body2">
              Large
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom>
            Content Density
          </Typography>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="content-density-label">Content Density</InputLabel>
            <Select
              labelId="content-density-label"
              id="content-density"
              value={accessibilitySettings.contentDensity}
              onChange={handleContentDensityChange}
              label="Content Density"
            >
              <MenuItem value="compact">Compact</MenuItem>
              <MenuItem value="normal">Normal</MenuItem>
              <MenuItem value="comfortable">Comfortable</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Typography gutterBottom>
            Language Preference
          </Typography>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="language-label">Language</InputLabel>
            <Select
              labelId="language-label"
              id="language"
              value={accessibilitySettings.language}
              onChange={handleLanguageChange}
              label="Language"
            >
              <MenuItem value="english">English</MenuItem>
              <MenuItem value="spanish">Spanish</MenuItem>
              <MenuItem value="french">French</MenuItem>
              <MenuItem value="german">German</MenuItem>
              <MenuItem value="chinese">Chinese</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Color Theme
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: '#0D47A1', 
                color: 'white', 
                borderRadius: 1, 
                textAlign: 'center',
                cursor: 'pointer',
                border: '2px solid transparent',
                '&:hover': {
                  border: '2px solid #000'
                }
              }}
            >
              <ColorLensIcon />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Blue (Default)
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: '#2E7D32', 
                color: 'white', 
                borderRadius: 1, 
                textAlign: 'center',
                cursor: 'pointer',
                border: '2px solid transparent',
                '&:hover': {
                  border: '2px solid #000'
                }
              }}
            >
              <ColorLensIcon />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Green
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: '#6A1B9A', 
                color: 'white', 
                borderRadius: 1, 
                textAlign: 'center',
                cursor: 'pointer',
                border: '2px solid transparent',
                '&:hover': {
                  border: '2px solid #000'
                }
              }}
            >
              <ColorLensIcon />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Purple
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: '#000', 
                color: 'white', 
                borderRadius: 1, 
                textAlign: 'center',
                cursor: 'pointer',
                border: '2px solid transparent',
                '&:hover': {
                  border: '2px solid #666'
                }
              }}
            >
              <ColorLensIcon />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Dark Mode
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          startIcon={<SaveIcon />}
          onClick={() => saveSettings('Accessibility')}
        >
          Save Accessibility Settings
        </Button>
      </Box>
    </Box>
  );
  
  const renderNotificationsTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Notification Preferences
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Control how and when you receive notifications about activities and updates.
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Delivery Methods
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationChange}
                  name="emailNotifications"
                  color="primary"
                />
              }
              label="Email Notifications"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onChange={handleNotificationChange}
                  name="pushNotifications"
                  color="primary"
                />
              }
              label="Push Notifications"
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Notification Types
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Internship Alerts" 
              secondary="New internships matching your skills and preferences"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={notificationSettings.internshipAlerts}
                onChange={handleNotificationChange}
                name="internshipAlerts"
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Project Invitations" 
              secondary="Invitations to join collaborative projects"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={notificationSettings.projectInvitations}
                onChange={handleNotificationChange}
                name="projectInvitations"
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Forum Replies" 
              secondary="Replies to your forum posts and comments"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={notificationSettings.forumReplies}
                onChange={handleNotificationChange}
                name="forumReplies"
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Application Updates" 
              secondary="Updates on your internship applications"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={notificationSettings.applicationUpdates}
                onChange={handleNotificationChange}
                name="applicationUpdates"
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Weekly Digest" 
              secondary="Weekly summary of activities and opportunities"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={notificationSettings.weeklyDigest}
                onChange={handleNotificationChange}
                name="weeklyDigest"
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Marketing Emails" 
              secondary="Promotional content and special offers"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={notificationSettings.marketingEmails}
                onChange={handleNotificationChange}
                name="marketingEmails"
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          startIcon={<SaveIcon />}
          onClick={() => saveSettings('Notification')}
        >
          Save Notification Settings
        </Button>
      </Box>
    </Box>
  );
  
  const renderAccountTab = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Account Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Manage your account information and security settings.
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Profile Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={accountSettings.name}
              onChange={handleAccountChange}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              value={accountSettings.email}
              onChange={handleAccountChange}
              variant="outlined"
              type="email"
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Change Password
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Current Password"
              name="currentPassword"
              value={accountSettings.currentPassword}
              onChange={handleAccountChange}
              variant="outlined"
              type="password"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              value={accountSettings.newPassword}
              onChange={handleAccountChange}
              variant="outlined"
              type="password"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              value={accountSettings.confirmPassword}
              onChange={handleAccountChange}
              variant="outlined"
              type="password"
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Privacy Settings
        </Typography>
        <List>
          <ListItem>
            <ListItemText 
              primary="Profile Visibility" 
              secondary="Make your profile visible to other users"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={privacySettings.showProfileToPublic}
                onChange={handlePrivacyChange}
                name="showProfileToPublic"
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText 
              primary="Email Visibility" 
              secondary="Show your email address on your profile"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={privacySettings.showEmail}
                onChange={handlePrivacyChange}
                name="showEmail"
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText 
              primary="Activity Sharing" 
              secondary="Share your activities on the platform"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={privacySettings.shareActivity}
                onChange={handlePrivacyChange}
                name="shareActivity"
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText 
              primary="Allow Tagging" 
              secondary="Allow other users to tag you in posts"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={privacySettings.allowTagging}
                onChange={handlePrivacyChange}
                name="allowTagging"
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider component="li" />
          <ListItem>
            <ListItemText 
              primary="Online Status" 
              secondary="Show when you're active on the platform"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={privacySettings.showOnlineStatus}
                onChange={handlePrivacyChange}
                name="showOnlineStatus"
                color="primary"
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          color="error"
          startIcon={<DeleteIcon />}
        >
          Delete Account
        </Button>
        <Button 
          variant="contained" 
          startIcon={<SaveIcon />}
          onClick={() => saveSettings('Account')}
        >
          Save Account Settings
        </Button>
      </Box>
    </Box>
  );
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Manage your account settings and preferences
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={tabIndex} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab 
            icon={<AccessibilityNewIcon />} 
            iconPosition="start" 
            label="Accessibility" 
            sx={{ borderRadius: '8px 8px 0 0' }} 
          />
          <Tab 
            icon={<NotificationsIcon />} 
            iconPosition="start" 
            label="Notifications" 
            sx={{ borderRadius: '8px 8px 0 0' }} 
          />
          <Tab 
            icon={<AccountCircleIcon />} 
            iconPosition="start" 
            label="Account & Privacy" 
            sx={{ borderRadius: '8px 8px 0 0' }} 
          />
        </Tabs>
      </Box>
      
      <Box sx={{ p: 0 }}>
        {tabIndex === 0 && renderAccessibilityTab()}
        {tabIndex === 1 && renderNotificationsTab()}
        {tabIndex === 2 && renderAccountTab()}
      </Box>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Settings; 