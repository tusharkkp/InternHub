import React, { useState, useEffect } from 'react';
import { 
  Box, Card, CardContent, Typography, Grid, Avatar, 
  Chip, Button, Divider, Rating, CircularProgress,
  List, ListItem, ListItemText, ListItemAvatar, Paper,
  Tab, Tabs, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { 
  PersonSearch, People, Work, School, 
  Psychology, EmojiPeople, CheckCircle, FilterList,
  Star, StarBorder
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

import matchingAlgorithm from './MatchingAlgorithm';

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#6573c3',
  },
  '& .MuiRating-iconHover': {
    color: '#3f51b5',
  },
});

// Custom circular progress with label
const CircularProgressWithLabel = ({ value, size = 50, thickness = 4 }) => {
  // Color based on score value
  const getColor = (score) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#2196f3';
    if (score >= 40) return '#ff9800';
    return '#f44336';
  };

  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        thickness={thickness}
        sx={{ color: getColor(value) }}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="textSecondary" fontSize={size/3}>
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
};

const MatchingDashboard = ({ userProfile, opportunities = [], teammates = [] }) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchedTeammates, setMatchedTeammates] = useState([]);
  const [matchedOpportunities, setMatchedOpportunities] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('compatibility');

  // Initial processing of matches
  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      if (userProfile && userProfile.personality?.type) {
        // Process teammate matches
        if (teammates && teammates.length > 0) {
          const processed = matchingAlgorithm.findIdealTeammates(userProfile, teammates);
          setMatchedTeammates(processed);
        }
        
        // Process opportunity matches
        if (opportunities && opportunities.length > 0) {
          const processed = matchingAlgorithm.findIdealOpportunities(userProfile, opportunities);
          setMatchedOpportunities(processed);
        }
      }
      
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [userProfile, teammates, opportunities]);

  // Filter teammates by type
  const filteredTeammates = matchedTeammates.filter(teammate => {
    if (filterType === 'all') return true;
    
    const personalityCategory = {
      'analysts': ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
      'diplomats': ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
      'sentinels': ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
      'explorers': ['ISTP', 'ISFP', 'ESTP', 'ESFP']
    };
    
    return personalityCategory[filterType]?.includes(teammate.personality?.type);
  });

  // Sort teammates
  const sortedTeammates = [...filteredTeammates].sort((a, b) => {
    if (sortBy === 'compatibility') {
      return b.compatibilityScore - a.compatibilityScore;
    } else if (sortBy === 'skillMatch') {
      return b.skillMatchScore - a.skillMatchScore;
    }
    return 0;
  });

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle filter change
  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  // Handle sort change
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  // Render teammate card
  const renderTeammateCard = (teammate) => {
    return (
      <Card key={teammate.id} sx={{ mb: 2, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar 
                  src={teammate.avatar} 
                  alt={teammate.name}
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">{teammate.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {teammate.title || 'Student'}
                  </Typography>
                  {teammate.personality?.type && (
                    <Chip 
                      size="small" 
                      label={teammate.personality.type}
                      sx={{ mt: 0.5, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              </Box>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                {teammate.bio || 'No bio available'}
              </Typography>
              
              <Box display="flex" flexWrap="wrap" gap={0.5} my={1}>
                {teammate.skills?.slice(0, 5).map((skill, idx) => (
                  <Chip 
                    key={idx}
                    label={typeof skill === 'string' ? skill : skill.name}
                    size="small"
                    variant="outlined"
                  />
                ))}
                {teammate.skills?.length > 5 && (
                  <Chip 
                    label={`+${teammate.skills.length - 5} more`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
              
              {teammate.potentialRoles?.length > 0 && (
                <Box mt={1}>
                  <Typography variant="caption" color="textSecondary">
                    Suggested Team Roles:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5} mt={0.5}>
                    {teammate.potentialRoles.map((role, idx) => (
                      <Chip 
                        key={idx}
                        label={role}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box display="flex" flexDirection="column" alignItems="center" height="100%" justifyContent="space-between">
                <Box textAlign="center" mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Compatibility Score
                  </Typography>
                  <CircularProgressWithLabel 
                    value={teammate.compatibilityScore || 0} 
                    size={80}
                  />
                </Box>
                
                <Box width="100%">
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="caption">Personality Match:</Typography>
                    <StyledRating 
                      value={teammate.personalityCompatibility?.overall / 20 || 0} 
                      precision={0.5} 
                      readOnly 
                      size="small"
                    />
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="caption">Skill Match:</Typography>
                    <StyledRating 
                      value={teammate.skillMatchScore / 20 || 0} 
                      precision={0.5} 
                      readOnly 
                      size="small"
                    />
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    Connect
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Render opportunity card
  const renderOpportunityCard = (opportunity) => {
    return (
      <Card key={opportunity.id} sx={{ mb: 2, boxShadow: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Typography variant="h6" gutterBottom>
                {opportunity.title}
              </Typography>
              
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar 
                  src={opportunity.companyLogo} 
                  alt={opportunity.company}
                  sx={{ width: 30, height: 30, mr: 1 }}
                />
                <Typography variant="body2" color="textSecondary">
                  {opportunity.company} • {opportunity.location}
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                {opportunity.description?.substring(0, 150)}
                {opportunity.description?.length > 150 ? '...' : ''}
              </Typography>
              
              <Box display="flex" flexWrap="wrap" gap={0.5} my={1}>
                {opportunity.requiredSkills?.slice(0, 5).map((skill, idx) => (
                  <Chip 
                    key={idx}
                    label={typeof skill === 'string' ? skill : skill.name}
                    size="small"
                    variant="outlined"
                  />
                ))}
                {opportunity.requiredSkills?.length > 5 && (
                  <Chip 
                    label={`+${opportunity.requiredSkills.length - 5} more`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>
              
              <Box display="flex" alignItems="center" gap={2} mt={1}>
                {opportunity.type && (
                  <Chip 
                    size="small" 
                    label={opportunity.type}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {opportunity.duration && (
                  <Typography variant="caption" color="textSecondary">
                    Duration: {opportunity.duration}
                  </Typography>
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Box display="flex" flexDirection="column" alignItems="center" height="100%" justifyContent="space-between">
                <Box textAlign="center" mb={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Match Score
                  </Typography>
                  <CircularProgressWithLabel 
                    value={opportunity.matchScore || 0} 
                    size={80}
                  />
                </Box>
                
                <Box width="100%">
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="caption">Skill Match:</Typography>
                    <StyledRating 
                      value={opportunity.skillMatchScore / 20 || 0} 
                      precision={0.5} 
                      readOnly 
                      size="small"
                    />
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="caption">Personality Fit:</Typography>
                    <StyledRating 
                      value={opportunity.affinityScore / 20 || 0} 
                      precision={0.5} 
                      readOnly 
                      size="small"
                    />
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    Apply
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Display loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
        <Typography variant="subtitle1" color="textSecondary" sx={{ ml: 2 }}>
          Analyzing personality and finding matches...
        </Typography>
      </Box>
    );
  }

  // If no personality data available
  if (!userProfile || !userProfile.personality?.type) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        height="400px"
        p={3}
      >
        <Psychology sx={{ fontSize: 60, color: '#9e9e9e', mb: 2 }} />
        <Typography variant="h6" gutterBottom align="center">
          Take a Personality Test First
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3, maxWidth: 500 }}>
          Complete a personality assessment so we can find teammates and opportunities 
          that match not just your skills, but your working style and preferences.
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<Psychology />}
          href="/personality-test" // Update with actual route
        >
          Take Personality Test
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ mb: 3, p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <EmojiPeople sx={{ fontSize: 40, color: '#3f51b5', mr: 2 }} />
              <Box>
                <Typography variant="h5">Your Personality Profile</Typography>
                <Typography variant="body2" color="textSecondary">
                  Based on your assessment results
                </Typography>
              </Box>
            </Box>
            
            <Box display="flex" alignItems="center" mb={1}>
              <Chip 
                label={userProfile.personality.type}
                color="primary"
                sx={{ mr: 1, fontWeight: 'bold' }}
              />
              <Typography variant="body2">
                {userProfile.personality.description?.substring(0, 100) || 'No description available'}
                {userProfile.personality.description?.length > 100 ? '...' : ''}
              </Typography>
            </Box>
            
            {userProfile.personality.traits && (
              <List dense>
                {Object.entries(userProfile.personality.traits).slice(0, 3).map(([trait, value]) => (
                  <ListItem key={trait} sx={{ py: 0 }}>
                    <ListItemText 
                      primary={trait.charAt(0).toUpperCase() + trait.slice(1)} 
                      secondary={`${Math.round(value)}%`}
                    />
                    <Rating 
                      value={value / 20} 
                      precision={0.5} 
                      readOnly 
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Recommended Roles
            </Typography>
            
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {matchingAlgorithm.getPotentialRoles(userProfile.personality.type).map((role, idx) => (
                <Chip 
                  key={idx}
                  label={role}
                  color="primary"
                  variant="outlined"
                  icon={<CheckCircle fontSize="small" />}
                />
              ))}
            </Box>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Skill Affinities
            </Typography>
            
            <Box display="flex" flexWrap="wrap" gap={1}>
              {matchingAlgorithm.getSkillAffinities(userProfile.personality.type).map((skill, idx) => (
                <Chip 
                  key={idx}
                  label={skill}
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="matching tabs">
          <Tab icon={<People />} label="Teammates" />
          <Tab icon={<Work />} label="Opportunities" />
        </Tabs>
      </Box>
      
      {/* Teammate Matches */}
      {tabValue === 0 && (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">
              Teammate Recommendations ({filteredTeammates.length})
            </Typography>
            
            <Box display="flex" gap={2}>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="filter-label">Personality</InputLabel>
                <Select
                  labelId="filter-label"
                  value={filterType}
                  onChange={handleFilterChange}
                  label="Personality"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="analysts">Analysts (NT)</MenuItem>
                  <MenuItem value="diplomats">Diplomats (NF)</MenuItem>
                  <MenuItem value="sentinels">Sentinels (SJ)</MenuItem>
                  <MenuItem value="explorers">Explorers (SP)</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="sort-label">Sort By</InputLabel>
                <Select
                  labelId="sort-label"
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sort By"
                >
                  <MenuItem value="compatibility">Compatibility</MenuItem>
                  <MenuItem value="skillMatch">Skill Match</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          
          {sortedTeammates.length === 0 ? (
            <Box textAlign="center" py={5}>
              <Typography variant="body1" color="textSecondary">
                No matching teammates found
              </Typography>
            </Box>
          ) : (
            sortedTeammates.map(teammate => renderTeammateCard(teammate))
          )}
        </>
      )}
      
      {/* Opportunity Matches */}
      {tabValue === 1 && (
        <>
          <Typography variant="h5" mb={2}>
            Opportunity Recommendations ({matchedOpportunities.length})
          </Typography>
          
          {matchedOpportunities.length === 0 ? (
            <Box textAlign="center" py={5}>
              <Typography variant="body1" color="textSecondary">
                No matching opportunities found
              </Typography>
            </Box>
          ) : (
            matchedOpportunities.map(opportunity => renderOpportunityCard(opportunity))
          )}
        </>
      )}
    </Box>
  );
};

export default MatchingDashboard; 