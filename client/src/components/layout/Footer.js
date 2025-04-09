import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Divider, 
  IconButton, 
  Stack,
  Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import YouTubeIcon from '@mui/icons-material/YouTube';

const footerLinks = [
  {
    title: 'Platform',
    links: [
      { name: 'Home', path: '/' },
      { name: 'Internships', path: '/internships' },
      { name: 'Projects', path: '/projects' },
      { name: 'Forum', path: '/forum' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Help Center', path: '/help' },
      { name: 'Career Resources', path: '/resources' },
      { name: 'Blog', path: '/blog' },
      { name: 'Success Stories', path: '/success-stories' }
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About Us', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Careers', path: '/careers' },
      { name: 'Partners', path: '/partners' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'Accessibility', path: '/accessibility' }
    ]
  }
];

const socialLinks = [
  { name: 'Facebook', icon: <FacebookIcon />, url: 'https://facebook.com' },
  { name: 'Twitter', icon: <TwitterIcon />, url: 'https://twitter.com' },
  { name: 'LinkedIn', icon: <LinkedInIcon />, url: 'https://linkedin.com' },
  { name: 'Instagram', icon: <InstagramIcon />, url: 'https://instagram.com' },
  { name: 'GitHub', icon: <GitHubIcon />, url: 'https://github.com' },
  { name: 'YouTube', icon: <YouTubeIcon />, url: 'https://youtube.com' }
];

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        borderTop: '1px solid',
        borderColor: 'divider',
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Internship Hub
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Connecting students with valuable internship opportunities and collaborative projects to enhance their skills and advance their careers.
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.name}
                    href={social.url}
                    aria-label={`Follow us on ${social.name}`}
                    size="small"
                    sx={{
                      '&:hover': {
                        color: 'primary.main',
                      },
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/register"
                sx={{ borderRadius: 2 }}
              >
                Join Now
              </Button>
            </Box>
          </Grid>
          {footerLinks.map((category) => (
            <Grid item xs={6} sm={3} md={2} key={category.title}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                {category.title}
              </Typography>
              <Box component="ul" sx={{ pl: 0, listStyle: 'none', m: 0 }}>
                {category.links.map((link) => (
                  <Box component="li" key={link.name} sx={{ mb: 1 }}>
                    <Link
                      component={RouterLink}
                      to={link.path}
                      variant="body2"
                      color="text.secondary"
                      underline="hover"
                      sx={{ '&:hover': { color: 'primary.main' } }}
                    >
                      {link.name}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 4 }} />
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md="auto">
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                textAlign: { xs: 'center', md: 'left' },
                mb: { xs: 2, md: 0 }
              }}
            >
              © {new Date().getFullYear()} Internship Hub. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} md="auto">
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2}
              sx={{ 
                textAlign: { xs: 'center', md: 'right' }
              }}
            >
              <Link
                href="#"
                variant="body2"
                color="text.secondary"
                underline="hover"
              >
                Support
              </Link>
              <Link
                href="#"
                variant="body2"
                color="text.secondary"
                underline="hover"
              >
                Community Guidelines
              </Link>
              <Link
                href="#"
                variant="body2"
                color="text.secondary"
                underline="hover"
              >
                Cookie Preferences
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer; 