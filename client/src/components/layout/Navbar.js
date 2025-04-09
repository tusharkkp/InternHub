import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider, 
  Badge, 
  Avatar, 
  useMediaQuery, 
  useTheme,
  Container,
  Tooltip,
  InputBase,
  ListItemAvatar,
  useScrollTrigger,
  Slide,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Person,
  WorkspacePremium,
  Work as WorkIcon,
  Group as GroupIcon,
  Forum as ForumIcon,
  Dashboard,
  Psychology,
  AccountCircle,
  PeopleAlt as PeopleAltIcon,
  PersonAdd,
  Login,
  ExitToApp,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Bookmark as BookmarkIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Home
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';

// Search bar styling
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  border: `1px solid ${alpha(theme.palette.common.white, 0.25)}`,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));

// Hide navbar on scroll down
function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const StyledNavLink = styled(Button)(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  fontWeight: active ? 'bold' : 'normal',
  textTransform: 'none',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  borderBottom: active ? `2px solid ${theme.palette.primary.main}` : 'none',
  borderRadius: 0,
  padding: theme.spacing(1.5, 2),
}));

const Navbar = ({ toggleDarkMode, darkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Internship Match',
      message: 'A new internship matching your skills is available',
      time: '2 hours ago',
      read: false,
      avatar: 'https://randomuser.me/api/portraits/women/43.jpg',
      link: '/internships?matchId=54321'
    },
    {
      id: 2,
      title: 'Application Update',
      message: 'Your application for Frontend Developer has been reviewed',
      time: '1 day ago',
      read: true,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      link: '/profile?tab=applications'
    },
    {
      id: 3,
      title: 'Project Invitation',
      message: 'You have been invited to join the E-commerce project',
      time: '3 days ago',
      read: false,
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      link: '/projects?invitation=123'
    }
  ]);
  
  const handleSearch = (event) => {
    if (event.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      // Close any open menus when search is executed
      handleMenuClose();
      handleNotificationMenuClose();
    }
  };
  
  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/login');
  };
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  
  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };
  
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };
  
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        elevation: 3,
        sx: { borderRadius: 2, mt: 1 }
      }}
    >
      <MenuItem
        onClick={handleMenuClose}
        component={RouterLink}
        to="/profile"
        sx={{ py: 1 }}
      >
        <ListItemIcon>
          <Person />
        </ListItemIcon>
        Profile
      </MenuItem>
      <MenuItem
        onClick={handleMenuClose}
        component={RouterLink}
        to="/dashboard"
        sx={{ py: 1 }}
      >
        <ListItemIcon>
          <Dashboard />
        </ListItemIcon>
        Dashboard
      </MenuItem>
      <MenuItem
        onClick={handleMenuClose}
        component={RouterLink}
        to="/saved"
        sx={{ py: 1 }}
      >
        <ListItemIcon>
          <BookmarkIcon />
        </ListItemIcon>
        Saved Items
      </MenuItem>
      <Divider />
      <MenuItem
        onClick={handleMenuClose}
        component={RouterLink}
        to="/settings"
        sx={{ py: 1 }}
      >
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        Settings
      </MenuItem>
      <MenuItem
        onClick={handleMenuClose}
        component={RouterLink}
        to="/help"
        sx={{ py: 1 }}
      >
        <ListItemIcon>
          <HelpIcon />
        </ListItemIcon>
        Help & Support
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout} sx={{ py: 1 }}>
        <ListItemIcon>
          <ExitToApp />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );
  
  const notificationId = 'primary-notification-menu';
  const notificationMenu = (
    <Menu
      anchorEl={notificationAnchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      id={notificationId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(notificationAnchorEl)}
      onClose={handleNotificationMenuClose}
      PaperProps={{
        elevation: 3,
        sx: { 
          borderRadius: 2, 
          mt: 1, 
          width: 320,
          maxHeight: 400 
        }
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        <Typography variant="h6" component="div">
          Notifications
        </Typography>
      </Box>
      
      {notifications.length > 0 ? (
        <>
          {notifications.map((notification) => (
            <MenuItem 
              key={notification.id} 
              onClick={() => handleNotificationClick(notification.id, notification.link)}
              sx={{ 
                py: 2,
                backgroundColor: notification.read ? 'inherit' : alpha(theme.palette.primary.light, 0.1)
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight="bold">{notification.title}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.message}
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </>
      ) : (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No new notifications
          </Typography>
        </Box>
      )}
      
      <Divider />
      <Box sx={{ p: 1, textAlign: 'center' }}>
        <Button 
          component={RouterLink} 
          to="/notifications"
          size="small"
          onClick={handleNotificationMenuClose}
        >
          View all notifications
        </Button>
      </Box>
    </Menu>
  );

  const drawerList = (
    <Box
      sx={{ width: 280 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ 
        py: 2, 
        px: 3, 
        display: 'flex', 
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="h6" fontWeight="bold">
          InternHub
        </Typography>
      </Box>
      
      <List sx={{ pt: 2 }}>
        <ListItem
          button
          component={RouterLink}
          to="/"
          selected={location.pathname === '/'}
          sx={{
            borderRadius: '0 24px 24px 0',
            mx: 1,
            '&.Mui-selected': {
              backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                backgroundColor: theme => alpha(theme.palette.primary.main, 0.2),
              }
            }
          }}
        >
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem
          button
          component={RouterLink}
          to="/profile"
          selected={location.pathname === '/profile'}
          sx={{
            borderRadius: '0 24px 24px 0',
            mx: 1,
            '&.Mui-selected': {
              backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                backgroundColor: theme => alpha(theme.palette.primary.main, 0.2),
              }
            }
          }}
        >
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        {isAuthenticated && (
          <ListItem
            button
            component={RouterLink}
            to="/my-workspace"
            selected={location.pathname === '/my-workspace'}
            sx={{
              borderRadius: '0 24px 24px 0',
              mx: 1,
              '&.Mui-selected': {
                backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: theme => alpha(theme.palette.primary.main, 0.2),
                }
              }
            }}
          >
            <ListItemIcon>
              <WorkspacePremium />
            </ListItemIcon>
            <ListItemText primary="My Workspace" />
          </ListItem>
        )}
        {isAuthenticated && (
          <ListItem
            button
            component={RouterLink}
            to="/teammates"
            selected={location.pathname === '/teammates'}
            sx={{
              borderRadius: '0 24px 24px 0',
              mx: 1,
              '&.Mui-selected': {
                backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: theme => alpha(theme.palette.primary.main, 0.2),
                }
              }
            }}
          >
            <ListItemIcon>
              <PeopleAltIcon />
            </ListItemIcon>
            <ListItemText primary="My Teammates" />
          </ListItem>
        )}
        <ListItem
          button
          component={RouterLink}
          to="/internships"
          selected={location.pathname === '/internships'}
          sx={{
            borderRadius: '0 24px 24px 0',
            mx: 1,
            '&.Mui-selected': {
              backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                backgroundColor: theme => alpha(theme.palette.primary.main, 0.2),
              }
            }
          }}
        >
          <ListItemIcon>
            <WorkIcon />
          </ListItemIcon>
          <ListItemText primary="Internships" />
        </ListItem>
        <ListItem
          button
          component={RouterLink}
          to="/projects"
          selected={location.pathname === '/projects'}
          sx={{
            borderRadius: '0 24px 24px 0',
            mx: 1,
            '&.Mui-selected': {
              backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                backgroundColor: theme => alpha(theme.palette.primary.main, 0.2),
              }
            }
          }}
        >
          <ListItemIcon>
            <GroupIcon />
          </ListItemIcon>
          <ListItemText primary="Projects" />
        </ListItem>
        <ListItem
          button
          component={RouterLink}
          to="/discussions"
          selected={location.pathname === '/discussions'}
          sx={{
            borderRadius: '0 24px 24px 0',
            mx: 1,
            '&.Mui-selected': {
              backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                backgroundColor: theme => alpha(theme.palette.primary.main, 0.2),
              }
            }
          }}
        >
          <ListItemIcon>
            <ForumIcon />
          </ListItemIcon>
          <ListItemText primary="Discussions" />
        </ListItem>
      </List>
      <Divider />
      <List>
        {isAuthenticated ? (
          <>
            <ListItem
              button
              component={RouterLink}
              to="/dashboard"
              selected={location.pathname === '/dashboard'}
              sx={{
                borderRadius: '0 24px 24px 0',
                mx: 1,
                '&.Mui-selected': {
                  backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: theme => alpha(theme.palette.primary.main, 0.2),
                  }
                }
              }}
            >
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
              button
              component={RouterLink}
              to="/personality-matching"
              selected={location.pathname === '/personality-matching'}
              sx={{
                borderRadius: '0 24px 24px 0',
                mx: 1,
                '&.Mui-selected': {
                  backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: theme => alpha(theme.palette.primary.main, 0.2),
                  }
                }
              }}
            >
              <ListItemIcon>
                <Psychology />
              </ListItemIcon>
              <ListItemText primary="Personality Matching" />
            </ListItem>
            <ListItem 
              button 
              onClick={handleLogout}
              sx={{
                borderRadius: '0 24px 24px 0',
                mx: 1
              }}
            >
              <ListItemIcon>
                <ExitToApp />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem
              button
              component={RouterLink}
              to="/login"
              selected={location.pathname === '/login'}
              sx={{
                borderRadius: '0 24px 24px 0',
                mx: 1,
                '&.Mui-selected': {
                  backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: theme => alpha(theme.palette.primary.main, 0.2),
                  }
                }
              }}
            >
              <ListItemIcon>
                <Login />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem
              button
              component={RouterLink}
              to="/register"
              selected={location.pathname === '/register'}
              sx={{
                borderRadius: '0 24px 24px 0',
                mx: 1,
                '&.Mui-selected': {
                  backgroundColor: theme => alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    backgroundColor: theme => alpha(theme.palette.primary.main, 0.2),
                  }
                }
              }}
            >
              <ListItemIcon>
                <PersonAdd />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
      <Divider />
      <List>
        <ListItem sx={{ px: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                name="darkMode"
                color="primary"
              />
            }
            label={darkMode ? "Dark Mode" : "Light Mode"}
          />
        </ListItem>
      </List>
    </Box>
  );

  // Function to handle notification click
  const handleNotificationClick = (notificationId, link) => {
    // Mark notification as read
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    // Close notification menu
    handleNotificationMenuClose();
    
    // Navigate to the specified link
    navigate(link);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <HideOnScroll>
        <AppBar position="fixed" color="default" elevation={1}>
          <Toolbar>
            {/* Logo */}
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{ 
                flexGrow: { xs: 1, md: 0 }, 
                textDecoration: 'none', 
                color: 'inherit',
                fontWeight: 700,
                letterSpacing: '.1rem',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {/* Remove or comment out the extra logo image */}
              {/* <img 
                src="/logo.png" 
                alt="Internship Hub" 
                style={{ height: 32, marginRight: 8 }} 
              /> */}
              InternHub
            </Typography>
            
            {/* Mobile menu button */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ 
                mr: 2, 
                display: { md: 'none' },
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.2)
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Search bar */}
            <Search sx={{ display: { xs: 'none', sm: 'block' } }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search internships, projects, skills..."
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
              />
            </Search>
            
            {/* Navigation links - desktop */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
              <StyledNavLink 
                component={RouterLink} 
                to="/profile"
                active={location.pathname === '/profile' ? 1 : 0}
                startIcon={<Person />}
              >
                Profile
              </StyledNavLink>
              {isAuthenticated && (
                <StyledNavLink 
                  component={RouterLink} 
                  to="/teammates"
                  active={location.pathname === '/teammates' ? 1 : 0}
                  startIcon={<PeopleAltIcon />}
                >
                  My Teammates
                </StyledNavLink>
              )}
              {isAuthenticated && (
                <StyledNavLink 
                  component={RouterLink} 
                  to="/my-workspace"
                  active={location.pathname === '/my-workspace' ? 1 : 0}
                  startIcon={<WorkspacePremium />}
                >
                  My Workspace
                </StyledNavLink>
              )}
              <StyledNavLink 
                component={RouterLink} 
                to="/internships"
                active={location.pathname === '/internships' ? 1 : 0}
                startIcon={<WorkIcon />}
              >
                Internships
              </StyledNavLink>
              <StyledNavLink 
                component={RouterLink} 
                to="/projects"
                active={location.pathname === '/projects' ? 1 : 0}
                startIcon={<GroupIcon />}
              >
                Projects
              </StyledNavLink>
              <StyledNavLink 
                component={RouterLink} 
                to="/discussions"
                active={location.pathname === '/discussions' ? 1 : 0}
                startIcon={<ForumIcon />}
              >
                Discussions
              </StyledNavLink>
            </Box>
            
            {/* Right side icons */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Dark mode toggle */}
              <IconButton onClick={toggleDarkMode} color="inherit">
                {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
              
              {/* Notification icon */}
              <IconButton 
                aria-label="show new notifications" 
                color="inherit"
                onClick={handleNotificationMenuOpen}
              >
                <Badge badgeContent={3} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              {/* Notification menu */}
              <Menu
                anchorEl={notificationAnchorEl}
                open={Boolean(notificationAnchorEl)}
                onClose={handleNotificationMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    width: 360,
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">Notifications</Typography>
                  <Button 
                    size="small" 
                    onClick={() => {
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    }}
                  >
                    Mark all as read
                  </Button>
                </Box>
                <Divider />
                <List sx={{ py: 0 }}>
                  {notifications.map((notification) => (
                    <ListItem 
                      key={notification.id}
                      alignItems="flex-start"
                      sx={{ 
                        backgroundColor: notification.read ? 'inherit' : alpha(theme.palette.primary.light, 0.1),
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.light, 0.2),
                        },
                        cursor: 'pointer'
                      }}
                      onClick={() => handleNotificationClick(notification.id, notification.link)}
                    >
                      <ListItemAvatar>
                        <Avatar src={notification.avatar} alt="User" />
                      </ListItemAvatar>
                      <ListItemText
                        primary={notification.title}
                        secondary={
                          <React.Fragment>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {notification.message}
                            </Typography>
                            <br />
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                            >
                              {notification.time}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                <Divider />
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Button component={RouterLink} to="/notifications">View all notifications</Button>
                </Box>
              </Menu>
              
              {/* Profile avatar */}
              {isAuthenticated ? (
                <>
                  <IconButton
                    edge="end"
                    aria-label="account of current user"
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    sx={{ ml: 1 }}
                  >
                    {user && user.avatar ? (
                      <Avatar 
                        src={user.avatar} 
                        alt={user.name}
                        sx={{ width: 35, height: 35 }}  
                      />
                    ) : (
                      <AccountCircle />
                    )}
                  </IconButton>
                </>
              ) : (
                <Box>
                  <Button component={RouterLink} to="/login" color="inherit">Login</Button>
                  <Button component={RouterLink} to="/register" variant="contained" color="primary" sx={{ ml: 1 }}>
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar /> {/* Add this to prevent content from hiding behind the AppBar */}
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            boxShadow: '0px 8px 10px -5px rgba(0,0,0,0.2), 0px 16px 24px 2px rgba(0,0,0,0.14), 0px 6px 30px 5px rgba(0,0,0,0.12)'
          }
        }}
      >
        {drawerList}
      </Drawer>
      
      {renderMenu}
      {notificationMenu}
    </Box>
  );
};

export default Navbar; 