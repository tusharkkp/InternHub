import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  TextField,
  CircularProgress,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Chip,
  Divider,
  LinearProgress
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CodeIcon from '@mui/icons-material/Code';
import QuizIcon from '@mui/icons-material/Quiz';
import SchoolIcon from '@mui/icons-material/School';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

const SkillAssessment = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [codeInput, setCodeInput] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [skillLevel, setSkillLevel] = useState('');
  
  // Mock assessment questions
  const javascriptQuestions = [
    {
      question: "What will be the output of the following code: console.log(typeof null)?",
      options: ['undefined', 'null', 'object', 'NaN'],
      correctAnswer: 'object',
      explanation: "In JavaScript, typeof null returns 'object', which is actually a historical bug in the language."
    },
    {
      question: "What's the difference between == and === in JavaScript?",
      options: [
        'They are exactly the same',
        '== compares values, === compares values and types',
        '=== compares values, == compares references',
        'None of the above'
      ],
      correctAnswer: '== compares values, === compares values and types',
      explanation: "== performs type coercion before comparison, while === doesn't perform type coercion and checks both value and type."
    },
    {
      question: "How do you properly clone an object in JavaScript?",
      options: [
        'const clone = obj',
        'const clone = Object.assign({}, obj)',
        'const clone = JSON.parse(JSON.stringify(obj))',
        'Both B and C are valid, depending on the use case'
      ],
      correctAnswer: 'Both B and C are valid, depending on the use case',
      explanation: "Object.assign() creates a shallow copy, while JSON.parse(JSON.stringify()) creates a deep copy with some limitations."
    }
  ];
  
  const reactQuestions = [
    {
      question: "What is the correct way to update state in React?",
      options: [
        'Directly modify the state variable',
        'Use the setState() or state updater function',
        'Create a new component with the updated state',
        'None of the above'
      ],
      correctAnswer: 'Use the setState() or state updater function',
      explanation: "React state should never be modified directly. Instead, use setState() for class components or the state updater function returned by useState() for functional components."
    },
    {
      question: "What is a key prop in React lists?",
      options: [
        'A prop that encrypts component data',
        'A unique identifier to help React identify which items have changed',
        'A required prop for all React components',
        'A performance optimization tool'
      ],
      correctAnswer: 'A unique identifier to help React identify which items have changed',
      explanation: "When rendering lists in React, keys help React identify which items have changed, are added, or are removed. This helps make the rendering process more efficient."
    }
  ];
  
  const questions = [...javascriptQuestions, ...reactQuestions];
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleCodeInputChange = (event) => {
    setCodeInput(event.target.value);
  };
  
  const handleAnswerSelect = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Analyze results
      analyzeResults();
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const analyzeResults = () => {
    setIsLoading(true);
    
    // Simulate API call to analyze results
    setTimeout(() => {
      const correctAnswers = questions.filter((q, index) => q.correctAnswer === answers[index]).length;
      const percentage = (correctAnswers / questions.length) * 100;
      
      let level = '';
      if (percentage >= 90) {
        level = 'Expert';
      } else if (percentage >= 70) {
        level = 'Advanced';
      } else if (percentage >= 50) {
        level = 'Intermediate';
      } else {
        level = 'Beginner';
      }
      
      setSkillLevel(level);
      
      // Mock skill analysis results
      setResults({
        correctAnswers,
        totalQuestions: questions.length,
        percentage,
        level,
        strengths: ['JavaScript core concepts', 'React state management'],
        areasToImprove: ['Advanced JavaScript patterns', 'React optimization techniques'],
        recommendedResources: [
          {
            title: 'Advanced JavaScript Concepts',
            link: 'https://javascript.info/advanced-functions'
          },
          {
            title: 'React Performance Optimization',
            link: 'https://reactjs.org/docs/optimizing-performance.html'
          }
        ]
      });
      
      setIsLoading(false);
      handleNext();
    }, 2000);
  };
  
  const handleSubmitCode = () => {
    if (!codeInput.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call to analyze code
    setTimeout(() => {
      // Mock code analysis
      setIsLoading(false);
      handleNext();
    }, 2000);
  };
  
  const renderQuestion = () => {
    const question = questions[currentQuestion];
    
    return (
      <Box>
        <Typography variant="subtitle1" gutterBottom fontWeight="medium">
          Question {currentQuestion + 1} of {questions.length}
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" gutterBottom>
            {question.question}
          </Typography>
          
          <FormControl component="fieldset">
            <RadioGroup value={answers[currentQuestion] || ''} onChange={(e) => handleAnswerSelect(e.target.value)}>
              {question.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={handleNextQuestion}
            disabled={!answers[currentQuestion]}
          >
            {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Box>
    );
  };
  
  const renderCodeChallenge = () => {
    return (
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Code Challenge: Create a counter in React
        </Typography>
        
        <Typography variant="body2" paragraph>
          Write a simple counter component in React using hooks that increments, decrements, and resets a counter value.
          Your component should include:
        </Typography>
        
        <ul>
          <li><Typography variant="body2">useState hook to manage the counter state</Typography></li>
          <li><Typography variant="body2">Increment button that adds 1 to the counter</Typography></li>
          <li><Typography variant="body2">Decrement button that subtracts 1 from the counter</Typography></li>
          <li><Typography variant="body2">Reset button that sets the counter back to 0</Typography></li>
        </ul>
        
        <TextField
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          value={codeInput}
          onChange={handleCodeInputChange}
          placeholder={`// Example:
import React, { useState } from 'react';

const Counter = () => {
  // Your code here
  
  return (
    // Your JSX here
  );
};

export default Counter;`}
          sx={{ fontFamily: 'monospace', mt: 2 }}
        />
        
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={handleBack}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitCode}
            disabled={!codeInput.trim() || isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Submit Code'}
          </Button>
        </Box>
      </Box>
    );
  };
  
  const renderResults = () => {
    if (!results) return null;
    
    return (
      <Box>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <MilitaryTechIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          <Typography variant="h5" gutterBottom fontWeight="bold">
            {results.level} Level
          </Typography>
          <Typography variant="body1">
            You answered {results.correctAnswers} out of {results.totalQuestions} questions correctly ({Math.round(results.percentage)}%)
          </Typography>
          
          <Box sx={{ mt: 2, mb: 3 }}>
            <Typography variant="body2" gutterBottom>
              Skill Mastery
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={results.percentage} 
              sx={{ 
                height: 10, 
                borderRadius: 5,
                mb: 1,
                bgcolor: 'background.paper',
                '& .MuiLinearProgress-bar': {
                  bgcolor: results.percentage >= 80 ? 'success.main' : 
                           results.percentage >= 60 ? 'primary.main' : 
                           results.percentage >= 40 ? 'warning.main' : 'error.main',
                }
              }} 
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption">Beginner</Typography>
              <Typography variant="caption">Intermediate</Typography>
              <Typography variant="caption">Advanced</Typography>
              <Typography variant="caption">Expert</Typography>
            </Box>
          </Box>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Your Strengths
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {results.strengths.map((strength, index) => (
              <Chip 
                key={index} 
                label={strength} 
                color="success" 
                icon={<VerifiedIcon />} 
              />
            ))}
          </Box>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Areas to Improve
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {results.areasToImprove.map((area, index) => (
              <Chip 
                key={index} 
                label={area} 
                color="primary" 
                variant="outlined" 
              />
            ))}
          </Box>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Recommended Resources
          </Typography>
          <ul>
            {results.recommendedResources.map((resource, index) => (
              <li key={index}>
                <Typography variant="body2">
                  <a href={resource.link} target="_blank" rel="noopener noreferrer">
                    {resource.title}
                  </a>
                </Typography>
              </li>
            ))}
          </ul>
        </Box>
        
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => {
              setActiveStep(0);
              setCurrentQuestion(0);
              setAnswers([]);
              setResults(null);
              setCodeInput('');
            }}
          >
            Take Another Assessment
          </Button>
        </Box>
      </Box>
    );
  };
  
  const steps = [
    {
      label: 'Knowledge Assessment',
      description: 'Answer technical questions to evaluate your theoretical knowledge',
      icon: <QuizIcon />,
      content: renderQuestion
    },
    {
      label: 'Code Challenge',
      description: 'Complete a coding task to demonstrate practical skills',
      icon: <CodeIcon />,
      content: renderCodeChallenge
    },
    {
      label: 'Results & Analysis',
      description: 'View your skill assessment results and personalized recommendations',
      icon: <AssessmentIcon />,
      content: renderResults
    }
  ];
  
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h5">
          AI Skill Assessment
        </Typography>
      </Box>
      
      <Alert severity="info" sx={{ mb: 3 }}>
        This assessment will evaluate your technical skills through a series of questions and a coding challenge. Your results will help identify your strengths and areas for improvement.
      </Alert>
      
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel icon={step.icon}>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Box sx={{ mt: 4 }}>
        {steps[activeStep].content()}
      </Box>
    </Paper>
  );
};

export default SkillAssessment; 