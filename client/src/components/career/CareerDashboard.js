import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
} from '@mui/material';
import {
  Work as WorkIcon,
  School as SchoolIcon,
  Code as CodeIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  EmojiEvents as EmojiEventsIcon,
  Lightbulb as LightbulbIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { careerService } from '../../services/careerService';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)',
  },
}));

const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  margin: theme.spacing(2, 0),
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
  },
}));

// Mock data for development
const mockCareerData = {
  progress: {
    stage: "Foundational Learning",
    progress: 65,
    completed: {
      internships: 1,
      projects: 5,
      certifications: 3
    },
    ongoing: {
      internships: 1,
      projects: 2,
      certifications: 2
    }
  },
  applications: [
    {
      id: 1,
      company: "TechCorp Inc.",
      position: "Frontend Developer Intern",
      status: "In Review",
      date: "2023-06-15"
    },
    {
      id: 2,
      company: "InnovateSoft",
      position: "Full Stack Developer",
      status: "Applied",
      date: "2023-06-10"
    },
    {
      id: 3,
      company: "GlobalTech Solutions",
      position: "React Developer",
      status: "Interview Scheduled",
      date: "2023-05-28"
    },
    {
      id: 4,
      company: "DataViz Analytics",
      position: "UI/UX Developer",
      status: "Rejected",
      date: "2023-05-15"
    }
  ],
  recommendedRoles: [
    {
      title: 'Frontend Developer',
      description: 'Build responsive and interactive web applications using modern frameworks and libraries.',
      requiredSkills: ['React.js', 'JavaScript', 'HTML/CSS', 'UI/UX Design'],
    },
    {
      title: 'Full Stack Developer',
      description: 'Develop end-to-end web applications with both frontend and backend expertise.',
      requiredSkills: ['React.js', 'Node.js', 'MongoDB', 'Express.js'],
    },
  ],
  recommendedPaths: [
    {
      id: 1,
      title: "Frontend Developer",
      match: 85,
      skills: ["React", "JavaScript", "HTML/CSS", "UI/UX"],
      roadmap: [
        { step: "Learn HTML/CSS fundamentals", status: "completed" },
        { step: "Master JavaScript basics", status: "completed" },
        { step: "Learn React framework", status: "in-progress" },
        { step: "Build portfolio projects", status: "in-progress" },
        { step: "Contribute to open-source", status: "planned" }
      ]
    },
    {
      id: 2,
      title: "Full Stack Developer",
      match: 70,
      skills: ["React", "Node.js", "MongoDB", "Express"],
      roadmap: [
        { step: "Learn frontend fundamentals", status: "completed" },
        { step: "Learn Node.js backend", status: "in-progress" },
        { step: "Master database concepts", status: "planned" },
        { step: "Build full-stack applications", status: "planned" }
      ]
    }
  ],
  skillGaps: [
    {
      role: "Frontend Developer",
      requiredSkills: ["React", "JavaScript", "HTML/CSS", "TypeScript", "Redux"],
      currentSkills: ["React", "JavaScript", "HTML/CSS"],
      missingSkills: ["TypeScript", "Redux"]
    },
    {
      role: "Full Stack Developer",
      requiredSkills: ["React", "Node.js", "MongoDB", "Express", "AWS"],
      currentSkills: ["React", "JavaScript"],
      missingSkills: ["Node.js", "MongoDB", "Express", "AWS"]
    }
  ],
  learningPath: [
    {
      title: 'Backend Development',
      description: 'Master server-side programming and database management',
      resources: [
        {
          title: 'Node.js Fundamentals',
          url: 'https://www.udemy.com/course/nodejs-fundamentals/',
        },
        {
          title: 'MongoDB Basics',
          url: 'https://www.mongodb.com/university/courses/M001',
        },
      ],
    },
    {
      title: 'System Design',
      description: 'Learn to design scalable and efficient systems',
      resources: [
        {
          title: 'System Design Primer',
          url: 'https://github.com/donnemartin/system-design-primer',
        },
        {
          title: 'Architecture Patterns',
          url: 'https://www.udemy.com/course/software-architecture-patterns/',
        },
      ],
    },
    {
      title: 'Cloud Technologies',
      description: 'Expand knowledge of cloud platforms and deployment',
      resources: [
        {
          title: 'AWS Essentials',
          url: 'https://www.coursera.org/learn/aws-fundamentals-going-cloud-native',
        },
        {
          title: 'Docker & Kubernetes',
          url: 'https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/',
        },
      ],
    },
  ],
  internshipMatches: [
    {
      title: 'Software Development Intern',
      company: 'TechCorp Inc.',
      duration: '3 months',
      location: 'Remote',
      applyUrl: 'https://techcorp.com/careers/internship',
    },
    {
      title: 'Full Stack Developer Intern',
      company: 'StartupX',
      duration: '6 months',
      location: 'Hybrid',
      applyUrl: 'https://startupx.com/careers/internship',
    },
  ],
  projectMatches: [
    {
      title: 'E-commerce Platform',
      description: 'Build a full-stack e-commerce solution with modern tech stack',
      requiredSkills: ['React.js', 'Node.js', 'MongoDB'],
      joinUrl: '/projects/1',
    },
    {
      title: 'AI Chat Application',
      description: 'Develop an AI-powered chat application with real-time features',
      requiredSkills: ['React.js', 'WebSocket', 'Python'],
      joinUrl: '/projects/2',
    },
  ],
  achievements: [
    {
      title: "React Developer Certification",
      date: "2023-05-15",
      type: "Certification"
    },
    {
      title: "Best Project Award",
      date: "2023-04-20",
      type: "Award"
    },
    {
      title: "Hackathon Winner",
      date: "2023-03-10",
      type: "Achievement"
    }
  ],
  analytics: {
    projectsCompleted: 8,
    weeklyLearningHours: 15,
    skillTrends: [
      { month: "Jan", progress: 30 },
      { month: "Feb", progress: 45 },
      { month: "Mar", progress: 60 },
      { month: "Apr", progress: 75 },
      { month: "May", progress: 85 }
    ]
  }
};

const CareerDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [careerData, setCareerData] = useState({
    progress: {
      stage: "",
      progress: 0,
      completed: {
        internships: 0,
        projects: 0,
        certifications: 0
      }
    },
    applications: [],
    recommendedRoles: [],
    recommendedPaths: [],
    skillGaps: [],
    learningPath: [],
    internshipMatches: [],
    projectMatches: [],
    achievements: [],
    analytics: {
      projectsCompleted: 0,
      weeklyLearningHours: 0,
      skillTrends: []
    },
    notifications: [],
  });
  const [expandedPath, setExpandedPath] = useState(null);

  useEffect(() => {
    fetchCareerData();
  }, []);

  const fetchCareerData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For development, use mock data directly
      setTimeout(() => {
        setCareerData(mockCareerData);
        setLoading(false);
      }, 1000);
      
      // In production, uncomment this code
      /*
      const data = await careerService.getCareerRecommendations(user?.id || '1');
      setCareerData(data);
      setLoading(false);
      */
    } catch (err) {
      console.error('Error fetching career data:', err);
      setError('Failed to load career recommendations. Please try again later.');
      setLoading(false);
      
      // Fallback to mock data even if there's an error
      setCareerData(mockCareerData);
    }
  };

  const handleRefresh = () => {
    fetchCareerData();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'info';
      case 'in review':
        return 'warning';
      case 'interview scheduled':
        return 'primary';
      case 'selected':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const handlePathExpand = (pathId) => {
    setExpandedPath(expandedPath === pathId ? null : pathId);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Career Dashboard
        </Typography>
        <Tooltip title="Refresh Recommendations">
          <IconButton onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Using demo data. The backend API is not connected.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Career Progress Overview */}
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Career Progress Overview
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TimelineIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">
                Current Stage: {careerData.progress?.stage || 'Not Available'}
              </Typography>
            </Box>
            <ProgressBar variant="determinate" value={careerData.progress?.progress || 0} />
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {careerData.progress?.completed?.internships || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed Internships
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {careerData.progress?.completed?.projects || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed Projects
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {careerData.progress?.completed?.certifications || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Completed Certifications
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </StyledPaper>
        </Grid>

        {/* Application Tracker */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Application Tracker
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Company</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(careerData.applications || []).map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{app.company}</TableCell>
                      <TableCell>{app.position}</TableCell>
                      <TableCell>
                        <Chip
                          label={app.status}
                          color={getStatusColor(app.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{app.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledPaper>
        </Grid>

        {/* Recommended Career Paths */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Recommended Career Paths
            </Typography>
            {(careerData.recommendedPaths || []).map((path) => (
              <Card key={path.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {path.title}
                    </Typography>
                    <Chip
                      label={`${path.match}% Match`}
                      color="primary"
                      size="small"
                    />
                  </Box>
                  <Box sx={{ mt: 1, mb: 1 }}>
                    {(path.skills || []).map((skill) => (
                      <Chip
                        key={skill}
                        label={skill}
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                  <Button
                    endIcon={expandedPath === path.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    onClick={() => handlePathExpand(path.id)}
                    size="small"
                  >
                    View Roadmap
                  </Button>
                  <Collapse in={expandedPath === path.id}>
                    <List>
                      {(path.roadmap || []).map((step, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            {step.status === 'completed' ? (
                              <CheckCircleIcon color="success" />
                            ) : step.status === 'in-progress' ? (
                              <TrendingUpIcon color="primary" />
                            ) : (
                              <LightbulbIcon color="action" />
                            )}
                          </ListItemIcon>
                          <ListItemText primary={step.step} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </CardContent>
              </Card>
            ))}
          </StyledPaper>
        </Grid>

        {/* Skill Gaps & Suggestions */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Skill Gaps & Suggestions
            </Typography>
            {(careerData.skillGaps || []).map((gap, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {gap.role}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Required Skills:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {(gap.requiredSkills || []).map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          color={(gap.currentSkills || []).includes(skill) ? 'success' : 'default'}
                          size="small"
                        />
                      ))}
                    </Box>
                  </Box>
                  {(gap.missingSkills || []).length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="error">
                        Missing Skills:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {(gap.missingSkills || []).map((skill) => (
                          <Chip
                            key={skill}
                            label={skill}
                            color="error"
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </StyledPaper>
        </Grid>

        {/* Achievements */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Achievements & Certifications
            </Typography>
            <List>
              {(careerData.achievements || []).map((achievement, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <EmojiEventsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={achievement.title}
                    secondary={achievement.date}
                  />
                  <Chip
                    label={achievement.type}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </ListItem>
              ))}
            </List>
          </StyledPaper>
        </Grid>

        {/* Career Insights & Analytics */}
        <Grid item xs={12}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>
              Career Insights & Analytics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {careerData.analytics?.projectsCompleted || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Projects Completed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {careerData.analytics?.weeklyLearningHours || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Weekly Learning Hours
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {careerData.analytics?.skillTrends?.[careerData.analytics?.skillTrends?.length - 1]?.progress || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Overall Progress
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </StyledPaper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CareerDashboard; 