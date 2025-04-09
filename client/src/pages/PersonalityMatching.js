import React, { useState } from 'react';
import { 
  Container, Box, Typography, Button, Tabs, Tab, Paper,
  Stepper, Step, StepLabel, StepContent, CircularProgress
} from '@mui/material';
import { 
  Psychology, PeopleAlt, Work, Assessment,
  ArrowBack, ArrowForward, PlayArrow
} from '@mui/icons-material';

// Import personality components
import PersonalityTest from '../components/personality/PersonalityTest';
import MatchingDashboard from '../components/personality/MatchingDashboard';
import { MatchingProvider, useMatching } from '../components/personality/MatchingProvider';

// Main content component that uses the matching context
const PersonalityMatchingContent = () => {
  const { userProfile, teammates, opportunities, loading } = useMatching();
  const [activeTab, setActiveTab] = useState(0);
  const [testCompleted, setTestCompleted] = useState(userProfile?.personality?.type ? true : false);
  
  // Handle personality test completion
  const handleTestComplete = (personalityData) => {
    setTestCompleted(true);
    setActiveTab(1); // Switch to dashboard after test completion
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // If loading
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
        <Typography variant="subtitle1" color="textSecondary" sx={{ ml: 2 }}>
          Loading personality matching system...
        </Typography>
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={6}>
        <Typography variant="h4" component="h1" gutterBottom>
          Personality-Based Matching
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
          Find the perfect teammates and opportunities based on personality compatibility
        </Typography>
      </Box>
      
      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="personality matching tabs"
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label="Take Personality Test" 
            icon={<Psychology />} 
            disabled={testCompleted && activeTab !== 0}
          />
          <Tab 
            label="Matching Dashboard" 
            icon={<PeopleAlt />} 
            disabled={!testCompleted}
          />
        </Tabs>
        
        {/* Personality Test */}
        {activeTab === 0 && (
          <Box p={3}>
            {testCompleted ? (
              <Box textAlign="center" py={3}>
                <Typography variant="h6" gutterBottom>
                  You've already completed the personality test
                </Typography>
                <Typography variant="body1" paragraph>
                  Your personality type is {userProfile.personality.type}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => setTestCompleted(false)}
                >
                  Retake Test
                </Button>
              </Box>
            ) : (
              <PersonalityTest onComplete={handleTestComplete} />
            )}
          </Box>
        )}
        
        {/* Matching Dashboard */}
        {activeTab === 1 && (
          <Box p={3}>
            <MatchingDashboard 
              userProfile={userProfile}
              teammates={teammates}
              opportunities={opportunities}
            />
          </Box>
        )}
      </Paper>
      
      {/* Information about personality-based matching */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          How Personality-Based Matching Works
        </Typography>
        
        <Stepper orientation="vertical" sx={{ mt: 3 }}>
          <Step active={true}>
            <StepLabel>Take the personality assessment</StepLabel>
            <StepContent>
              <Typography variant="body2">
                Complete a personality test inspired by the Myers-Briggs Type Indicator (MBTI) 
                and Big Five personality traits. This helps us understand your working style,
                communication preferences, and natural strengths.
              </Typography>
            </StepContent>
          </Step>
          
          <Step active={true}>
            <StepLabel>Get your personality profile</StepLabel>
            <StepContent>
              <Typography variant="body2">
                Receive your personality type along with insights about your traits, strengths,
                potential roles, and skill affinities that align with your personality type.
              </Typography>
            </StepContent>
          </Step>
          
          <Step active={true}>
            <StepLabel>Find compatible teammates</StepLabel>
            <StepContent>
              <Typography variant="body2">
                Our algorithm analyzes personality compatibility between you and potential teammates.
                It considers complementary traits, working style compatibility, and skill alignment
                to suggest the most compatible collaborators.
              </Typography>
            </StepContent>
          </Step>
          
          <Step active={true}>
            <StepLabel>Discover matching opportunities</StepLabel>
            <StepContent>
              <Typography variant="body2">
                We match you with internships and projects that not only align with your skills,
                but also with work environments and roles that complement your personality type
                and preferences.
              </Typography>
            </StepContent>
          </Step>
        </Stepper>
      </Paper>
      
      {/* Benefits section */}
      <Box mb={6}>
        <Typography variant="h5" gutterBottom mb={3}>
          Benefits of Personality-Based Matching
        </Typography>
        
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
          <Paper sx={{ p: 3, flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Better Team Dynamics
            </Typography>
            <Typography variant="body2">
              Teams with complementary personality types tend to have better communication,
              fewer conflicts, and more efficient collaboration. Our matching system helps
              create balanced teams where members' strengths complement each other.
            </Typography>
          </Paper>
          
          <Paper sx={{ p: 3, flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Increased Job Satisfaction
            </Typography>
            <Typography variant="body2">
              Working in environments and roles that align with your personality type leads to
              higher job satisfaction and productivity. Our matching algorithm helps you find
              opportunities where you'll naturally thrive.
            </Typography>
          </Paper>
          
          <Paper sx={{ p: 3, flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Personal Growth
            </Typography>
            <Typography variant="body2">
              Understanding your personality type helps you leverage your natural strengths and
              work on potential blind spots. Our system provides personalized insights to support
              your professional development.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

// Wrap the content with the provider for the entire page
const PersonalityMatching = () => {
  return (
    <MatchingProvider>
      <PersonalityMatchingContent />
    </MatchingProvider>
  );
};

export default PersonalityMatching; 