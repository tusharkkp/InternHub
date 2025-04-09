import React from 'react';
import { Box, Typography, Paper, LinearProgress, Chip, Grid } from '@mui/material';

// In a real application, we would use a charting library like Chart.js or Recharts
// For simplicity, we're using a custom visualization

const SkillsRadar = ({ skills = [] }) => {
  // Mock skill levels for demonstration
  const mockSkillLevels = {
    'React': 85,
    'JavaScript': 90,
    'Node.js': 75,
    'Express': 70,
    'MongoDB': 65,
    'HTML/CSS': 95,
    'Python': 60,
    'Data Analysis': 55,
    'UI/UX Design': 80,
    'Git': 85
  };
  
  // Group skills by category
  const skillCategories = {
    'Frontend': ['React', 'JavaScript', 'HTML/CSS', 'UI/UX Design'],
    'Backend': ['Node.js', 'Express', 'MongoDB'],
    'Other': ['Python', 'Git', 'Data Analysis']
  };
  
  // If no skills are provided, use mock data
  const displaySkills = skills.length > 0 ? skills : Object.keys(mockSkillLevels);
  
  const getSkillLevel = (skill) => {
    return mockSkillLevels[skill] || Math.floor(Math.random() * 40) + 60; // Random value between 60-100 for demo
  };
  
  const getColorByLevel = (level) => {
    if (level < 60) return '#f44336'; // Red
    if (level < 75) return '#ff9800'; // Orange
    if (level < 90) return '#2196f3'; // Blue
    return '#4caf50'; // Green
  };
  
  const renderSkillsByCategory = () => {
    return Object.entries(skillCategories).map(([category, categorySkills]) => {
      const filteredSkills = displaySkills.filter(skill => categorySkills.includes(skill));
      
      if (filteredSkills.length === 0) return null;
      
      return (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            {category}
          </Typography>
          <Grid container spacing={2}>
            {filteredSkills.map(skill => {
              const level = getSkillLevel(skill);
              return (
                <Grid item xs={12} sm={6} key={skill}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{skill}</Typography>
                      <Typography variant="body2" fontWeight="bold">{level}%</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={level} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: getColorByLevel(level)
                        }
                      }} 
                    />
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      );
    });
  };
  
  const renderTopSkills = () => {
    const topSkills = [...displaySkills]
      .sort((a, b) => getSkillLevel(b) - getSkillLevel(a))
      .slice(0, 5);
      
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {topSkills.map(skill => {
          const level = getSkillLevel(skill);
          return (
            <Chip 
              key={skill} 
              label={`${skill} (${level}%)`} 
              sx={{ 
                bgcolor: getColorByLevel(level),
                color: 'white',
                fontWeight: 'bold'
              }} 
            />
          );
        })}
      </Box>
    );
  };
  
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Skills Dashboard
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Top Skills
        </Typography>
        {renderTopSkills()}
      </Box>
      
      <Box>
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Skill Breakdown
        </Typography>
        {renderSkillsByCategory()}
      </Box>
    </Paper>
  );
};

export default SkillsRadar; 