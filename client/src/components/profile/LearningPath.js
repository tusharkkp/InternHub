import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent, 
  Button, 
  Link, 
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import BookIcon from '@mui/icons-material/Book';
import CodeIcon from '@mui/icons-material/Code';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RefreshIcon from '@mui/icons-material/Refresh';

const LearningPath = () => {
  const [careerPath, setCareerPath] = useState('fullstack');
  const [activeStep, setActiveStep] = useState(0);
  
  const careerPaths = [
    { value: 'frontend', label: 'Frontend Developer' },
    { value: 'backend', label: 'Backend Developer' },
    { value: 'fullstack', label: 'Full Stack Developer' },
    { value: 'data', label: 'Data Scientist' },
    { value: 'mobile', label: 'Mobile Developer' },
    { value: 'devops', label: 'DevOps Engineer' }
  ];
  
  const handleCareerPathChange = (event) => {
    setCareerPath(event.target.value);
    setActiveStep(0);
  };
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  
  // Define learning paths based on career choice
  const getLearningPathSteps = () => {
    switch(careerPath) {
      case 'frontend':
        return [
          {
            label: 'HTML, CSS, and JavaScript Fundamentals',
            description: 'Master the core technologies of the web',
            resources: [
              { name: 'MDN Web Docs', link: 'https://developer.mozilla.org/en-US/' },
              { name: 'freeCodeCamp Frontend Certification', link: 'https://www.freecodecamp.org/learn/responsive-web-design/' },
              { name: 'JavaScript.info', link: 'https://javascript.info/' }
            ],
            skills: ['HTML5', 'CSS3', 'JavaScript ES6+']
          },
          {
            label: 'Frontend Framework Mastery',
            description: 'Learn React and its ecosystem',
            resources: [
              { name: 'React Documentation', link: 'https://reactjs.org/docs/getting-started.html' },
              { name: 'React Router', link: 'https://reactrouter.com/' },
              { name: 'Redux Toolkit', link: 'https://redux-toolkit.js.org/' }
            ],
            skills: ['React', 'Redux', 'React Router']
          },
          {
            label: 'Advanced Frontend Concepts',
            description: 'Optimize performance and improve UI/UX',
            resources: [
              { name: 'Web Performance Fundamentals', link: 'https://web.dev/performance-get-started/' },
              { name: 'Accessibility on the Web', link: 'https://web.dev/accessibility/' },
              { name: 'Testing React Applications', link: 'https://reactjs.org/docs/testing.html' }
            ],
            skills: ['Performance Optimization', 'Accessibility', 'Testing']
          }
        ];
      case 'backend':
        return [
          {
            label: 'Server-side Programming',
            description: 'Learn Node.js and Express',
            resources: [
              { name: 'Node.js Documentation', link: 'https://nodejs.org/en/docs/' },
              { name: 'Express.js Guide', link: 'https://expressjs.com/en/guide/routing.html' },
              { name: 'REST API Design Principles', link: 'https://restfulapi.net/' }
            ],
            skills: ['Node.js', 'Express', 'REST APIs']
          },
          {
            label: 'Database Management',
            description: 'Master SQL and NoSQL databases',
            resources: [
              { name: 'MongoDB University', link: 'https://university.mongodb.com/' },
              { name: 'PostgreSQL Tutorial', link: 'https://www.postgresqltutorial.com/' },
              { name: 'Database Design Fundamentals', link: 'https://www.youtube.com/watch?v=ztHopE5Wnpc' }
            ],
            skills: ['MongoDB', 'PostgreSQL', 'Database Design']
          },
          {
            label: 'Advanced Backend Development',
            description: 'Implement authentication, security, and deploy scalable applications',
            resources: [
              { name: 'Web Security Academy', link: 'https://portswigger.net/web-security' },
              { name: 'Authentication Strategies in Node.js', link: 'https://www.passportjs.org/' },
              { name: 'Introduction to Microservices', link: 'https://microservices.io/patterns/microservices.html' }
            ],
            skills: ['Authentication', 'Security', 'Microservices']
          }
        ];
      case 'fullstack':
        return [
          {
            label: 'Frontend & Backend Fundamentals',
            description: 'Build a solid foundation in both frontend and backend technologies',
            resources: [
              { name: 'The Odin Project', link: 'https://www.theodinproject.com/' },
              { name: 'Full Stack Open', link: 'https://fullstackopen.com/en/' },
              { name: 'JavaScript: The Complete Guide', link: 'https://www.udemy.com/course/javascript-the-complete-guide-2020-beginner-advanced/' }
            ],
            skills: ['HTML/CSS', 'JavaScript', 'Node.js', 'Express']
          },
          {
            label: 'MERN Stack Development',
            description: 'Master MongoDB, Express, React, and Node.js',
            resources: [
              { name: 'MERN Stack Front To Back', link: 'https://www.udemy.com/course/mern-stack-front-to-back/' },
              { name: 'React & Redux Projects', link: 'https://www.freecodecamp.org/learn/front-end-development-libraries/' },
              { name: 'MongoDB Atlas Documentation', link: 'https://docs.atlas.mongodb.com/' }
            ],
            skills: ['React', 'Redux', 'MongoDB', 'Express', 'Node.js']
          },
          {
            label: 'Advanced Full Stack Development',
            description: 'Learn deployment, CI/CD, and application architecture',
            resources: [
              { name: 'AWS for Developers', link: 'https://aws.amazon.com/getting-started/hands-on/build-react-app-amplify-graphql/' },
              { name: 'CI/CD with GitHub Actions', link: 'https://docs.github.com/en/actions' },
              { name: 'Clean Code in JavaScript', link: 'https://github.com/ryanmcdermott/clean-code-javascript' }
            ],
            skills: ['AWS', 'CI/CD', 'Architecture', 'Clean Code']
          }
        ];
      case 'data':
        return [
          {
            label: 'Python for Data Science',
            description: 'Learn Python and its data science libraries',
            resources: [
              { name: 'Python Data Science Handbook', link: 'https://jakevdp.github.io/PythonDataScienceHandbook/' },
              { name: 'NumPy and Pandas Fundamentals', link: 'https://www.datacamp.com/courses/introduction-to-numpy' },
              { name: 'Data Visualization with Matplotlib', link: 'https://matplotlib.org/stable/tutorials/index.html' }
            ],
            skills: ['Python', 'NumPy', 'Pandas', 'Matplotlib']
          },
          {
            label: 'Machine Learning Fundamentals',
            description: 'Understand core ML concepts and algorithms',
            resources: [
              { name: 'Scikit-Learn Tutorial', link: 'https://scikit-learn.org/stable/tutorial/index.html' },
              { name: 'Machine Learning Crash Course', link: 'https://developers.google.com/machine-learning/crash-course' },
              { name: 'Kaggle Learn', link: 'https://www.kaggle.com/learn/overview' }
            ],
            skills: ['Scikit-Learn', 'Supervised Learning', 'Unsupervised Learning']
          },
          {
            label: 'Deep Learning & Advanced Data Science',
            description: 'Master deep learning frameworks and big data',
            resources: [
              { name: 'Deep Learning with TensorFlow', link: 'https://www.tensorflow.org/tutorials' },
              { name: 'Fast.ai Practical Deep Learning', link: 'https://course.fast.ai/' },
              { name: 'Big Data with Apache Spark', link: 'https://spark.apache.org/docs/latest/' }
            ],
            skills: ['TensorFlow', 'PyTorch', 'Apache Spark', 'Big Data']
          }
        ];
      default:
        return [
          {
            label: 'Web Development Fundamentals',
            description: 'Master HTML, CSS, and JavaScript',
            resources: [
              { name: 'MDN Web Docs', link: 'https://developer.mozilla.org/en-US/' },
              { name: 'freeCodeCamp', link: 'https://www.freecodecamp.org/' },
              { name: 'JavaScript.info', link: 'https://javascript.info/' }
            ],
            skills: ['HTML5', 'CSS3', 'JavaScript ES6+']
          },
          {
            label: 'Frontend & Backend Development',
            description: 'Learn React and Node.js',
            resources: [
              { name: 'React Documentation', link: 'https://reactjs.org/docs/getting-started.html' },
              { name: 'Node.js Documentation', link: 'https://nodejs.org/en/docs/' },
              { name: 'MongoDB University', link: 'https://university.mongodb.com/' }
            ],
            skills: ['React', 'Node.js', 'MongoDB']
          },
          {
            label: 'DevOps & Deployment',
            description: 'Understand CI/CD and cloud deployment',
            resources: [
              { name: 'GitHub Actions Documentation', link: 'https://docs.github.com/en/actions' },
              { name: 'AWS Free Tier', link: 'https://aws.amazon.com/free/' },
              { name: 'Docker Getting Started', link: 'https://docs.docker.com/get-started/' }
            ],
            skills: ['Git', 'CI/CD', 'Docker', 'AWS']
          }
        ];
    }
  };
  
  const steps = getLearningPathSteps();
  
  // Recommended courses and certifications
  const recommendedCourses = [
    {
      title: "React - The Complete Guide",
      provider: "Udemy",
      rating: 4.8,
      link: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/"
    },
    {
      title: "The Complete Node.js Developer Course",
      provider: "Udemy",
      rating: 4.7,
      link: "https://www.udemy.com/course/the-complete-nodejs-developer-course-2/"
    },
    {
      title: "MongoDB - The Complete Developer's Guide",
      provider: "Udemy",
      rating: 4.6,
      link: "https://www.udemy.com/course/mongodb-the-complete-developers-guide/"
    }
  ];
  
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Learning Path
        </Typography>
        <Box>
          <FormControl variant="outlined" size="small" sx={{ width: 200 }}>
            <InputLabel id="career-path-label">Career Goal</InputLabel>
            <Select
              labelId="career-path-label"
              id="career-path"
              value={careerPath}
              onChange={handleCareerPathChange}
              label="Career Goal"
            >
              {careerPaths.map((path) => (
                <MenuItem key={path.value} value={path.value}>
                  {path.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          Personalized Learning Roadmap for {careerPaths.find(p => p.value === careerPath)?.label}
        </Typography>
        
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography variant="subtitle1" fontWeight="medium">
                  {step.label}
                </Typography>
              </StepLabel>
              <StepContent>
                <Typography variant="body2">{step.description}</Typography>
                
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="body2" fontWeight="medium" gutterBottom>
                    Key Skills:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {step.skills.map((skill, idx) => (
                      <Chip key={idx} label={skill} size="small" color="primary" variant="outlined" />
                    ))}
                  </Box>
                </Box>
                
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="body2" fontWeight="medium" gutterBottom>
                    Learning Resources:
                  </Typography>
                  <List dense>
                    {step.resources.map((resource, idx) => (
                      <ListItem key={idx} disableGutters>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <BookIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Link href={resource.link} target="_blank" rel="noopener noreferrer">
                              {resource.name}
                            </Link>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {index === steps.length - 1 ? 'Finish' : 'Continue'}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3, mt: 2, bgcolor: 'success.light', color: 'success.contrastText', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              🎉 Congratulations!
            </Typography>
            <Typography paragraph>
              You've completed the learning roadmap for becoming a {careerPaths.find(p => p.value === careerPath)?.label}. 
              Continue practicing and building projects to reinforce your skills.
            </Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }} startIcon={<RefreshIcon />}>
              Reset Path
            </Button>
          </Paper>
        )}
      </Box>
      
      <Divider sx={{ my: 3 }} />
      
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          <TrendingUpIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Recommended Courses & Certifications
        </Typography>
        
        <Grid container spacing={2}>
          {recommendedCourses.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {course.provider}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <StarIcon sx={{ color: 'warning.main', mr: 0.5 }} fontSize="small" />
                    <Typography variant="body2" fontWeight="medium">
                      {course.rating}/5.0
                    </Typography>
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    component={Link} 
                    href={course.link} 
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ mt: 2 }}
                  >
                    View Course
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default LearningPath; 