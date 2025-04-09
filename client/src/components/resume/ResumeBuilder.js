import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Tabs, 
  Tab, 
  Divider,
  TextField, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  Chip
} from '@mui/material';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import PreviewIcon from '@mui/icons-material/Preview';
import TemplateIcon from '@mui/icons-material/ViewCompact';
import ContentIcon from '@mui/icons-material/Edit';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Resume preview container
const ResumePreviewContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
  overflow: 'auto',
  '& .resume-preview': {
    width: '210mm',
    minHeight: '297mm',
    padding: theme.spacing(4),
    margin: '0 auto',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    position: 'relative'
  }
}));

// Resume templates
const RESUME_TEMPLATES = [
  { id: 'modern', name: 'Modern', color: '#3f51b5' },
  { id: 'classic', name: 'Classic', color: '#2e7d32' },
  { id: 'minimal', name: 'Minimal', color: '#424242' },
  { id: 'creative', name: 'Creative', color: '#d32f2f' },
];

const ResumeBuilder = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const resumeRef = useRef(null);
  
  // Resume data state
  const [resumeData, setResumeData] = useState({
    template: 'modern',
    accentColor: '#3f51b5',
    personalInfo: {
      name: user?.name || 'Alex Johnson',
      title: 'Full Stack Developer',
      email: user?.email || 'alex.johnson@example.com',
      phone: '(123) 456-7890',
      location: 'San Francisco, CA',
      linkedIn: 'linkedin.com/in/alexjohnson',
      github: 'github.com/alexjohnson',
      website: 'alexjohnson.dev',
      summary: 'Passionate software developer with experience in building full-stack web applications using modern JavaScript frameworks and libraries. Strong problem-solving skills and focus on writing clean, maintainable code.'
    },
    education: [
      {
        id: 1,
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science in Computer Science',
        date: '2019 - 2023',
        details: 'GPA: 3.8/4.0, Dean\'s List, Computer Science Student Association'
      }
    ],
    experience: [
      {
        id: 1,
        company: 'Tech Startup',
        position: 'Junior Web Developer',
        date: 'Jun 2023 - Present',
        details: 'Developing web applications using React and Node.js. Working in an agile team to deliver features on time and with high quality. Implementing responsive designs and optimizing application performance.'
      },
      {
        id: 2,
        company: 'Web Agency',
        position: 'Web Development Intern',
        date: 'Jan 2023 - May 2023',
        details: 'Assisted in building client websites and learned modern web technologies. Implemented designs from Figma prototypes to responsive web pages using HTML, CSS, and JavaScript.'
      }
    ],
    skills: [
      'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'HTML/CSS', 'Git', 'AWS'
    ],
    projects: [
      {
        id: 1,
        title: 'E-commerce Platform',
        description: 'A full-stack e-commerce application with React, Node.js, and MongoDB',
        link: 'github.com/username/ecommerce'
      },
      {
        id: 2,
        title: 'Weather Dashboard',
        description: 'A weather application that displays real-time weather data using a third-party API',
        link: 'github.com/username/weather-app'
      }
    ],
    certifications: [
      {
        id: 1,
        name: 'Full Stack Web Development',
        issuer: 'Coding Bootcamp',
        date: '2022'
      }
    ]
  });
  
  // Update resume data with user data from Redux store
  useEffect(() => {
    if (user) {
      setResumeData(prevData => ({
        ...prevData,
        personalInfo: {
          ...prevData.personalInfo,
          name: user.name || prevData.personalInfo.name,
          email: user.email || prevData.personalInfo.email,
          // Add other user data if available
        },
        skills: user.skills || prevData.skills
      }));
    }
  }, [user]);
  
  // Handle template change
  const handleTemplateChange = (templateId) => {
    const selectedTemplate = RESUME_TEMPLATES.find(t => t.id === templateId);
    setResumeData(prevData => ({
      ...prevData,
      template: templateId,
      accentColor: selectedTemplate.color
    }));
  };
  
  // Handle color change
  const handleColorChange = (color) => {
    setResumeData(prevData => ({
      ...prevData,
      accentColor: color
    }));
  };
  
  // Handle personal info changes
  const handlePersonalInfoChange = (field, value) => {
    setResumeData(prevData => ({
      ...prevData,
      personalInfo: {
        ...prevData.personalInfo,
        [field]: value
      }
    }));
  };
  
  // Generate PDF resume
  const generatePDF = async () => {
    if (!resumeRef.current) return;
    
    setIsLoading(true);
    
    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        format: 'a4',
        unit: 'mm'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;
      
      pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`);
      
      setSnackbar({
        open: true,
        message: 'Resume PDF generated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      setSnackbar({
        open: true,
        message: 'Error generating PDF. Please try again.',
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Share resume link
  const shareResume = () => {
    // This would typically save to the server and generate a shareable link
    setIsLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      const shareLink = `https://example.com/shared-resume/${Date.now().toString(36)}`;
      
      // Copy link to clipboard
      navigator.clipboard.writeText(shareLink).then(() => {
        setSnackbar({
          open: true,
          message: 'Share link copied to clipboard!',
          severity: 'success'
        });
      });
      
      setIsLoading(false);
    }, 1500);
  };
  
  // Render the template selection panel
  const renderTemplatePanel = () => (
    <Grid container spacing={3}>
      {RESUME_TEMPLATES.map((template) => (
        <Grid item xs={12} sm={6} md={3} key={template.id}>
          <Paper 
            elevation={resumeData.template === template.id ? 8 : 1}
            onClick={() => handleTemplateChange(template.id)}
            sx={{
              p: 2,
              cursor: 'pointer',
              border: resumeData.template === template.id ? 
                `2px solid ${template.color}` : '2px solid transparent',
              '&:hover': {
                boxShadow: 4
              },
              transition: 'all 0.3s'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 1 }}>
              <TemplateIcon sx={{ fontSize: 40, color: template.color }} />
            </Box>
            <Typography variant="subtitle1" align="center" fontWeight="medium">
              {template.name}
            </Typography>
          </Paper>
        </Grid>
      ))}
      
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Accent Color
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {['#3f51b5', '#2e7d32', '#424242', '#d32f2f', '#1976d2', '#ed6c02', '#9c27b0', '#00796b'].map((color) => (
            <Box 
              key={color}
              onClick={() => handleColorChange(color)}
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                bgcolor: color,
                cursor: 'pointer',
                border: resumeData.accentColor === color ? '3px solid #000' : '3px solid transparent',
                '&:hover': {
                  opacity: 0.8
                }
              }}
            />
          ))}
        </Box>
      </Grid>
    </Grid>
  );
  
  // Render the content editing panel
  const renderContentPanel = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={resumeData.personalInfo.name}
              onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Professional Title"
              value={resumeData.personalInfo.title}
              onChange={(e) => handlePersonalInfoChange('title', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              value={resumeData.personalInfo.email}
              onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={resumeData.personalInfo.phone}
              onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Location"
              value={resumeData.personalInfo.location}
              onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="LinkedIn"
              value={resumeData.personalInfo.linkedIn}
              onChange={(e) => handlePersonalInfoChange('linkedIn', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="GitHub"
              value={resumeData.personalInfo.github}
              onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Website"
              value={resumeData.personalInfo.website}
              onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Professional Summary"
              value={resumeData.personalInfo.summary}
              onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
              margin="normal"
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
      </Grid>
      
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Skills
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {resumeData.skills.map((skill, index) => (
            <Chip 
              key={index} 
              label={skill} 
              color="primary" 
              variant="outlined" 
              onDelete={() => {
                setResumeData(prevData => ({
                  ...prevData,
                  skills: prevData.skills.filter((_, i) => i !== index)
                }));
              }}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', mt: 2 }}>
          <TextField
            fullWidth
            label="Add Skill"
            placeholder="Enter a skill and press Enter"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                setResumeData(prevData => ({
                  ...prevData,
                  skills: [...prevData.skills, e.target.value.trim()]
                }));
                e.target.value = '';
              }
            }}
          />
        </Box>
      </Grid>
      
      {/* Additional sections for education, experience, projects, certifications would go here */}
    </Grid>
  );
  
  // Modern resume template
  const renderModernTemplate = () => (
    <Box className="resume-preview" ref={resumeRef} sx={{ fontFamily: 'Arial, sans-serif' }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: resumeData.accentColor }}>
          {resumeData.personalInfo.name}
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
          {resumeData.personalInfo.title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2">{resumeData.personalInfo.email}</Typography>
          <Typography variant="body2">{resumeData.personalInfo.phone}</Typography>
          <Typography variant="body2">{resumeData.personalInfo.location}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
          {resumeData.personalInfo.linkedIn && (
            <Typography variant="body2">LinkedIn: {resumeData.personalInfo.linkedIn}</Typography>
          )}
          {resumeData.personalInfo.github && (
            <Typography variant="body2">GitHub: {resumeData.personalInfo.github}</Typography>
          )}
          {resumeData.personalInfo.website && (
            <Typography variant="body2">Web: {resumeData.personalInfo.website}</Typography>
          )}
        </Box>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ 
          mb: 1, 
          pb: 1, 
          borderBottom: `2px solid ${resumeData.accentColor}`,
          color: resumeData.accentColor,
          fontWeight: 'bold'
        }}>
          Summary
        </Typography>
        <Typography variant="body1">
          {resumeData.personalInfo.summary}
        </Typography>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ 
          mb: 1, 
          pb: 1, 
          borderBottom: `2px solid ${resumeData.accentColor}`,
          color: resumeData.accentColor,
          fontWeight: 'bold'
        }}>
          Skills
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {resumeData.skills.map((skill, index) => (
            <Chip 
              key={index} 
              label={skill} 
              size="small"
              sx={{ 
                backgroundColor: `${resumeData.accentColor}20`, 
                color: resumeData.accentColor,
                fontWeight: 'medium'
              }} 
            />
          ))}
        </Box>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ 
          mb: 1, 
          pb: 1, 
          borderBottom: `2px solid ${resumeData.accentColor}`,
          color: resumeData.accentColor,
          fontWeight: 'bold'
        }}>
          Experience
        </Typography>
        {resumeData.experience.map((exp) => (
          <Box key={exp.id} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {exp.position}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {exp.date}
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ color: resumeData.accentColor }}>
              {exp.company}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {exp.details}
            </Typography>
          </Box>
        ))}
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ 
          mb: 1, 
          pb: 1, 
          borderBottom: `2px solid ${resumeData.accentColor}`,
          color: resumeData.accentColor,
          fontWeight: 'bold'
        }}>
          Education
        </Typography>
        {resumeData.education.map((edu) => (
          <Box key={edu.id} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {edu.degree}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {edu.date}
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ color: resumeData.accentColor }}>
              {edu.institution}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {edu.details}
            </Typography>
          </Box>
        ))}
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ 
          mb: 1, 
          pb: 1, 
          borderBottom: `2px solid ${resumeData.accentColor}`,
          color: resumeData.accentColor,
          fontWeight: 'bold'
        }}>
          Projects
        </Typography>
        {resumeData.projects.map((project) => (
          <Box key={project.id} sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {project.title}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {project.description}
            </Typography>
            {project.link && (
              <Typography variant="body2" sx={{ color: resumeData.accentColor, mt: 0.5 }}>
                {project.link}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
      
      {resumeData.certifications.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ 
            mb: 1, 
            pb: 1, 
            borderBottom: `2px solid ${resumeData.accentColor}`,
            color: resumeData.accentColor,
            fontWeight: 'bold'
          }}>
            Certifications
          </Typography>
          {resumeData.certifications.map((cert) => (
            <Box key={cert.id} sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {cert.name}
              </Typography>
              <Typography variant="body2">
                {cert.issuer} • {cert.date}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
  
  // Render the resume preview based on selected template
  const renderResumePreview = () => {
    switch (resumeData.template) {
      case 'modern':
        return renderModernTemplate();
      // Other templates would be implemented here
      default:
        return renderModernTemplate();
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return renderTemplatePanel();
      case 1:
        return renderContentPanel();
      default:
        return renderTemplatePanel();
    }
  };
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={5} lg={4}>
        <Paper elevation={3} sx={{ p: 0, borderRadius: 2, height: '100%' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<TemplateIcon />} label="Template" />
            <Tab icon={<ContentIcon />} label="Content" />
          </Tabs>
          
          <Box sx={{ p: 3, height: 'calc(100% - 48px)', overflowY: 'auto' }}>
            {renderTabContent()}
          </Box>
        </Paper>
      </Grid>
      
      <Grid item xs={12} md={7} lg={8}>
        <Paper elevation={3} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">
              Resume Preview
            </Typography>
            <Box>
              <Button 
                variant="contained" 
                startIcon={<PictureAsPdfIcon />}
                onClick={generatePDF}
                disabled={isLoading}
                sx={{ mr: 1 }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Download PDF'}
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<ShareIcon />}
                onClick={shareResume}
                disabled={isLoading}
              >
                Share
              </Button>
            </Box>
          </Box>
          
          <ResumePreviewContainer>
            {renderResumePreview()}
          </ResumePreviewContainer>
        </Paper>
      </Grid>
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ResumeBuilder; 