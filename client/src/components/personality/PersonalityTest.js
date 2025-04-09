import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  FormControl, 
  RadioGroup, 
  FormControlLabel, 
  Radio,
  CircularProgress,
  Alert
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Psychology as PsychologyIcon } from '@mui/icons-material';
import { updateProfile } from '../../store/slices/authSlice';

const PersonalityTest = ({ onComplete }) => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector(state => state.auth);
  
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState(null);

  // Personality test questions - simplified version (10 questions)
  const questions = [
    {
      id: 'q1',
      question: 'How do you tend to recharge?',
      trait: 'E-I', // Extraversion vs Introversion
      options: [
        { value: 'E', label: 'Being around other people energizes me' },
        { value: 'I', label: 'I need time alone to recharge' }
      ]
    },
    {
      id: 'q2',
      question: 'How do you prefer to process information?',
      trait: 'S-N', // Sensing vs Intuition
      options: [
        { value: 'S', label: 'I focus on concrete facts and details' },
        { value: 'N', label: 'I look for patterns and possibilities' }
      ]
    },
    {
      id: 'q3',
      question: 'How do you make decisions?',
      trait: 'T-F', // Thinking vs Feeling
      options: [
        { value: 'T', label: 'I prioritize logic and objective criteria' },
        { value: 'F', label: 'I consider people and special circumstances' }
      ]
    },
    {
      id: 'q4',
      question: 'How do you approach work and planning?',
      trait: 'J-P', // Judging vs Perceiving
      options: [
        { value: 'J', label: 'I prefer structure, planning, and organization' },
        { value: 'P', label: 'I am flexible and prefer to keep options open' }
      ]
    },
    {
      id: 'q5',
      question: 'In group settings, you typically:',
      trait: 'E-I',
      options: [
        { value: 'E', label: 'Take initiative in conversations and activities' },
        { value: 'I', label: 'Prefer to observe before participating' }
      ]
    },
    {
      id: 'q6',
      question: 'When solving problems, you often rely on:',
      trait: 'S-N',
      options: [
        { value: 'S', label: 'Past experience and proven methods' },
        { value: 'N', label: 'New approaches and creative solutions' }
      ]
    },
    {
      id: 'q7',
      question: 'When giving feedback, you tend to be:',
      trait: 'T-F',
      options: [
        { value: 'T', label: 'Direct and straightforward, focusing on improvement' },
        { value: 'F', label: 'Tactful and encouraging, focusing on the positive' }
      ]
    },
    {
      id: 'q8',
      question: 'Your workspace is typically:',
      trait: 'J-P',
      options: [
        { value: 'J', label: 'Organized with a place for everything' },
        { value: 'P', label: 'Adaptable with items arranged as needed' }
      ]
    },
    {
      id: 'q9',
      question: 'When in a conflict, you usually:',
      trait: 'T-F',
      options: [
        { value: 'T', label: 'Focus on finding the logical solution regardless of feelings' },
        { value: 'F', label: 'Consider how everyone feels and strive for harmony' }
      ]
    },
    {
      id: 'q10',
      question: 'When approaching a project, you prefer to:',
      trait: 'J-P',
      options: [
        { value: 'J', label: 'Have a clear plan and timeline from the start' },
        { value: 'P', label: 'Adapt as you go and explore different approaches' }
      ]
    }
  ];

  // Calculate personality type based on answers
  const calculatePersonalityType = () => {
    const traits = {
      'E': 0, 'I': 0,
      'S': 0, 'N': 0,
      'T': 0, 'F': 0,
      'J': 0, 'P': 0
    };

    // Count the responses for each trait
    Object.values(answers).forEach(answer => {
      traits[answer]++;
    });

    // Determine the dominant trait in each pair
    const type = [
      traits['E'] > traits['I'] ? 'E' : 'I',
      traits['S'] > traits['N'] ? 'S' : 'N',
      traits['T'] > traits['F'] ? 'T' : 'F',
      traits['J'] > traits['P'] ? 'J' : 'P'
    ].join('');

    return type;
  };

  // Get the personality description based on type
  const getPersonalityDescription = (type) => {
    const descriptions = {
      'ISTJ': 'Responsible, organized, and practical. You are detail-oriented and reliable.',
      'ISFJ': 'Caring, dependable, and conscientious. You excel at creating harmonious environments.',
      'INFJ': 'Creative, insightful, and principled. You have a clear vision and strong values.',
      'INTJ': 'Strategic, independent, and analytical. You are a natural planner with high standards.',
      'ISTP': 'Logical, adaptable, and observant. You excel at troubleshooting complex problems.',
      'ISFP': 'Artistic, sensitive, and in-the-moment. You value authenticity and personal expression.',
      'INFP': 'Idealistic, empathetic, and creative. You are driven by your core values and vision.',
      'INTP': 'Analytical, objective, and theoretical. You enjoy exploring complex ideas and systems.',
      'ESTP': 'Energetic, practical, and spontaneous. You are action-oriented and adaptable.',
      'ESFP': 'Enthusiastic, sociable, and expressive. You bring fun and practicality to projects.',
      'ENFP': 'Imaginative, enthusiastic, and people-oriented. You see possibilities everywhere.',
      'ENTP': 'Innovative, strategic, and versatile. You enjoy intellectual challenges and debates.',
      'ESTJ': 'Efficient, logical, and structured. You are good at implementing concrete plans.',
      'ESFJ': 'Warm, conscientious, and cooperative. You value tradition and social connection.',
      'ENFJ': 'Charismatic, empathetic, and organized. You inspire and develop others.',
      'ENTJ': 'Decisive, strategic, and efficient. You are a natural leader focused on goals.'
    };

    return descriptions[type] || 'A balanced personality with diverse traits and preferences.';
  };

  // Get work style insights based on type
  const getWorkStyleInsights = (type) => {
    const insights = {
      'ISTJ': 'You thrive in structured environments with clear expectations. Best matched with creative types who can benefit from your organization.',
      'ISFJ': 'You excel at supportive roles and detailed work. Pair well with visionary types who can provide direction.',
      'INFJ': 'You contribute vision and depth to projects. Work well with practical teammates who can help implement your ideas.',
      'INTJ': 'You bring strategic thinking and systems design. Complement well with detail-oriented and people-focused teammates.',
      'ISTP': 'You excel at troubleshooting and technical problem-solving. Work well with planners who can provide structure.',
      'ISFP': 'You bring creativity and adaptability. Pair well with organized teammates who can help with structure.',
      'INFP': 'You contribute values-driven ideas and creativity. Work well with action-oriented teammates.',
      'INTP': 'You bring analytical depth and innovation. Complement well with implementation-focused teammates.',
      'ESTP': 'You excel at tactical problem-solving and crisis management. Work well with strategic planners.',
      'ESFP': 'You bring energy and practicality. Pair well with detail-oriented and analytical teammates.',
      'ENFP': 'You contribute enthusiasm and innovation. Work well with structured, detail-focused teammates.',
      'ENTP': 'You bring creative problem-solving and adaptability. Complement well with implementation-focused partners.',
      'ESTJ': 'You excel at organization and execution. Work well with creative, big-picture thinkers.',
      'ESFJ': 'You bring harmony and practical support. Pair well with visionary and analytical teammates.',
      'ENFJ': 'You contribute leadership and people development. Work well with detail-oriented and analytical types.',
      'ENTJ': 'You excel at strategic leadership and efficiency. Complement well with detail-focused and supportive teammates.'
    };

    return insights[type] || 'Your balanced approach allows you to adapt to various team dynamics and work styles.';
  };

  // Calculate Big Five traits from MBTI
  const calculateBigFiveTraits = (type) => {
    // Mapping from MBTI to rough Big Five equivalents
    // This is a simplified approximation
    const bigFive = {
      // Extraversion (E/I)
      extraversion: type.includes('E') ? 75 : 25,
      
      // Agreeableness (F/T with some influence from E/I)
      agreeableness: type.includes('F') ? 
        (type.includes('E') ? 80 : 65) : 
        (type.includes('I') ? 35 : 45),
      
      // Conscientiousness (J/P with some influence from S/N)
      conscientiousness: type.includes('J') ? 
        (type.includes('S') ? 85 : 70) : 
        (type.includes('N') ? 30 : 40),
      
      // Neuroticism (approximated from I/E and F/T combinations)
      neuroticism: (type.includes('I') && type.includes('F')) ? 65 :
                  (type.includes('E') && type.includes('T')) ? 30 :
                  50,
      
      // Openness (N/S with some influence from P/J)
      openness: type.includes('N') ? 
        (type.includes('P') ? 85 : 70) : 
        (type.includes('J') ? 25 : 40)
    };
    
    return bigFive;
  };

  const handleNext = () => {
    // Validate current step has an answer
    const currentQuestion = questions[activeStep].id;
    if (!answers[currentQuestion]) {
      setError('Please select an answer before continuing.');
      return;
    }
    
    setError(null);
    
    if (activeStep === questions.length - 1) {
      // Last question, calculate results
      handleComplete();
    } else {
      // Move to next question
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1);
    setError(null);
  };

  const handleAnswerChange = (event) => {
    const questionId = questions[activeStep].id;
    setAnswers({
      ...answers,
      [questionId]: event.target.value
    });
    setError(null);
  };

  const handleComplete = async () => {
    try {
      const personalityType = calculatePersonalityType();
      const personalityDescription = getPersonalityDescription(personalityType);
      const workStyleInsights = getWorkStyleInsights(personalityType);
      const bigFiveTraits = calculateBigFiveTraits(personalityType);
      
      const personalityData = {
        type: personalityType,
        description: personalityDescription,
        workStyleInsights: workStyleInsights,
        bigFiveTraits: bigFiveTraits,
        testCompletedAt: new Date().toISOString()
      };
      
      // Update user profile with personality data
      dispatch(updateProfile({ 
        ...user, 
        personality: personalityData 
      }));
      
      // If callback provided, call it with the personality data
      if (onComplete) {
        onComplete(personalityData);
      }
    } catch (error) {
      console.error("Error saving personality test results:", error);
      setError("There was an error saving your results. Please try again.");
    }
  };

  // If user already has personality data
  if (user?.personality?.type && !loading) {
    return (
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PsychologyIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5">Your Personality Profile</Typography>
        </Box>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          You've already completed the personality assessment. You can view your results below.
        </Alert>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Your Type: {user.personality.type}</Typography>
          <Typography variant="body1">{user.personality.description}</Typography>
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Work Style Insights</Typography>
          <Typography variant="body1">{user.personality.workStyleInsights}</Typography>
        </Box>
        
        <Box>
          <Typography variant="h6">Team Compatibility</Typography>
          <Typography variant="body1">
            Based on your personality profile, you'll work well with teammates who complement your strengths.
          </Typography>
        </Box>
        
        <Button 
          variant="outlined" 
          sx={{ mt: 2 }}
          onClick={() => {
            setAnswers({});
            setActiveStep(0);
            setError(null);
          }}
        >
          Retake Test
        </Button>
      </Paper>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PsychologyIcon color="primary" sx={{ mr: 1, fontSize: 32 }} />
        <Typography variant="h5">Personality Assessment</Typography>
      </Box>
      
      <Typography variant="body1" paragraph>
        This short assessment will help us match you with compatible teammates and suitable internships. 
        Answer honestly for the best results!
      </Typography>
      
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {questions.map((_, index) => (
          <Step key={index}>
            <StepLabel></StepLabel>
          </Step>
        ))}
      </Stepper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {questions[activeStep].question}
        </Typography>
        
        <FormControl component="fieldset">
          <RadioGroup
            name={`question-${questions[activeStep].id}`}
            value={answers[questions[activeStep].id] || ''}
            onChange={handleAnswerChange}
          >
            {questions[activeStep].options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option.value}
                control={<Radio />}
                label={option.label}
                sx={{ mb: 1 }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        
        <Button
          variant="contained"
          onClick={handleNext}
        >
          {activeStep === questions.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Paper>
  );
};

export default PersonalityTest; 