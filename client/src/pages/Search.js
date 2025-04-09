import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  InputAdornment, 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Chip, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Divider,
  IconButton,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import ClearIcon from '@mui/icons-material/Clear';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import ForumIcon from '@mui/icons-material/Forum';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';

// Mock data for search results
const MOCK_SEARCH_DATA = {
  internships: [
    {
      id: 1,
      title: 'Frontend Developer Intern',
      company: 'TechCorp',
      location: 'New York, NY',
      type: 'Remote',
      posted: '2 days ago',
      stipend: '$1000/month',
      duration: '3 months',
      description: 'Looking for a passionate frontend developer intern to join our team...',
      skills: ['React', 'JavaScript', 'HTML', 'CSS']
    },
    {
      id: 2,
      title: 'Backend Developer Intern',
      company: 'DataSystems Inc.',
      location: 'San Francisco, CA',
      type: 'Onsite',
      posted: '1 week ago',
      stipend: '$1200/month',
      duration: '6 months',
      description: 'Join our backend team to develop scalable APIs and services...',
      skills: ['Node.js', 'Express', 'MongoDB', 'AWS']
    },
    {
      id: 3,
      title: 'UX/UI Design Intern',
      company: 'CreativeHub',
      location: 'Chicago, IL',
      type: 'Hybrid',
      posted: '3 days ago',
      stipend: '$800/month',
      duration: '4 months',
      description: 'Help design intuitive user interfaces for our products...',
      skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping']
    }
  ],
  projects: [
    {
      id: 1,
      title: 'E-commerce Website Redesign',
      creator: 'Alex Johnson',
      status: 'In Progress',
      members: 3,
      requiredSkills: ['React', 'UX Design', 'Node.js'],
      description: 'Redesigning an e-commerce platform for better user experience and conversion rates.'
    },
    {
      id: 2,
      title: 'Mobile App Development',
      creator: 'Sarah Williams',
      status: 'Recruiting',
      members: 2,
      requiredSkills: ['React Native', 'Firebase', 'UI Design'],
      description: 'Building a mobile app for tracking fitness activities and providing recommendations.'
    }
  ],
  discussions: [
    {
      id: 1,
      title: 'How to prepare for technical interviews?',
      author: 'Mark Davis',
      replies: 15,
      posted: '1 day ago',
      tags: ['Career Advice', 'Interviews']
    },
    {
      id: 2,
      title: 'Best resources to learn React in 2023',
      author: 'Jessica Smith',
      replies: 8,
      posted: '3 days ago',
      tags: ['React', 'Learning Resources']
    }
  ]
};

const Search = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState({
    internships: [],
    projects: [],
    discussions: []
  });
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    duration: '',
    skills: []
  });
  
  // Parse query parameters from URL on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const q = queryParams.get('q');
    
    if (q) {
      setSearchQuery(q);
      // Search will be triggered by the query change effect
    }
  }, [location.search]);
  
  // Function to handle search
  const handleSearch = () => {
    setLoading(true);
    
    // Update URL with search query without reloading page
    if (searchQuery.trim()) {
      const queryParams = new URLSearchParams();
      queryParams.set('q', searchQuery);
      navigate(`/search?${queryParams.toString()}`, { replace: true });
    }
    
    // Simulate API call delay
    setTimeout(() => {
      // Filter results based on search query and filters
      const filteredResults = {
        internships: MOCK_SEARCH_DATA.internships.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
        ),
        projects: MOCK_SEARCH_DATA.projects.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.requiredSkills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
        ),
        discussions: MOCK_SEARCH_DATA.discussions.filter(item => 
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      };
      
      setSearchResults(filteredResults);
      setLoading(false);
    }, 800);
  };
  
  // Effect to trigger search when query changes
  useEffect(() => {
    if (searchQuery.length > 2) {
      const timerId = setTimeout(() => {
        handleSearch();
      }, 500);
      
      return () => clearTimeout(timerId);
    } else if (searchQuery === '') {
      setSearchResults({
        internships: [],
        projects: [],
        discussions: []
      });
    }
  }, [searchQuery, filters]);
  
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults({
      internships: [],
      projects: [],
      discussions: []
    });
  };
  
  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
  };
  
  const getTotalResults = () => {
    return searchResults.internships.length + 
           searchResults.projects.length + 
           searchResults.discussions.length;
  };
  
  const renderInternships = () => (
    <Grid container spacing={3}>
      {searchResults.internships.length > 0 ? (
        searchResults.internships.map(internship => (
          <Grid item xs={12} key={internship.id}>
            <Card variant="outlined" sx={{ 
              borderRadius: 2,
              '&:hover': { boxShadow: 3, borderColor: 'primary.main' }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" component="div">
                    {internship.title}
                  </Typography>
                  <Chip 
                    label={internship.type} 
                    size="small" 
                    color={
                      internship.type === 'Remote' ? 'success' : 
                      internship.type === 'Hybrid' ? 'info' : 'default'
                    }
                  />
                </Box>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {internship.company}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                  <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                  <Typography variant="body2">
                    {internship.location}
                  </Typography>
                  <AccessTimeIcon fontSize="small" sx={{ ml: 2, mr: 0.5 }} />
                  <Typography variant="body2">
                    {internship.posted}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {internship.description.substring(0, 120)}...
                </Typography>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {internship.stipend} • {internship.duration}
                  </Typography>
                </Box>
                <Box>
                  {internship.skills.map((skill, index) => (
                    <Chip 
                      key={index} 
                      label={skill} 
                      size="small" 
                      sx={{ m: 0.5, ml: index === 0 ? 0 : 0.5 }}
                    />
                  ))}
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Button 
                    component={RouterLink}
                    to={`/internships`}
                    variant="contained" 
                    size="small"
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No internships found matching your search criteria.
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
  
  const renderProjects = () => (
    <Grid container spacing={3}>
      {searchResults.projects.length > 0 ? (
        searchResults.projects.map(project => (
          <Grid item xs={12} md={6} key={project.id}>
            <Card variant="outlined" sx={{ 
              borderRadius: 2,
              height: '100%',
              '&:hover': { boxShadow: 3, borderColor: 'primary.main' }
            }}>
              <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ mb: 1 }}>
                  <Typography variant="h6">
                    {project.title}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    By {project.creator}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Chip 
                    label={project.status} 
                    size="small" 
                    color={
                      project.status === 'Recruiting' ? 'success' : 
                      project.status === 'In Progress' ? 'primary' : 
                      'default'
                    }
                  />
                  <Typography variant="body2">
                    {project.members} {project.members === 1 ? 'member' : 'members'}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 2, flexGrow: 1 }}>
                  {project.description}
                </Typography>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Required skills:
                  </Typography>
                  {project.requiredSkills.map((skill, index) => (
                    <Chip 
                      key={index} 
                      label={skill} 
                      size="small" 
                      sx={{ m: 0.5, ml: index === 0 ? 0 : 0.5 }}
                    />
                  ))}
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Button 
                    component={RouterLink}
                    to={`/projects`}
                    variant="contained" 
                    size="small"
                  >
                    View Project
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No projects found matching your search criteria.
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
  
  const renderDiscussions = () => (
    <Grid container spacing={3}>
      {searchResults.discussions.length > 0 ? (
        searchResults.discussions.map(discussion => (
          <Grid item xs={12} key={discussion.id}>
            <Card variant="outlined" sx={{ 
              borderRadius: 2, 
              p: 2,
              '&:hover': { boxShadow: 3, borderColor: 'primary.main' }
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6" component={RouterLink} to="/forum" sx={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                    '&:hover': { color: 'primary.main' }
                  }}>
                    {discussion.title}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Posted by {discussion.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>
                      •
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {discussion.posted}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                {discussion.tags.map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={tag} 
                    size="small" 
                    sx={{ mr: 1, mt: 1 }}
                  />
                ))}
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button 
                  component={RouterLink}
                  to="/forum"
                  variant="outlined" 
                  size="small"
                >
                  View Discussion
                </Button>
              </Box>
            </Card>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No discussions found matching your search criteria.
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
  
  const renderTabContent = () => {
    switch (category) {
      case 'internships':
        return renderInternships();
      case 'projects':
        return renderProjects();
      case 'discussions':
        return renderDiscussions();
      default:
        return (
          <>
            {searchResults.internships.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <WorkIcon sx={{ mr: 1 }} /> Internships
                  </Typography>
                  {searchResults.internships.length > 3 && (
                    <Button 
                      component={RouterLink} 
                      to="#" 
                      onClick={() => setCategory('internships')}
                      size="small"
                    >
                      View all ({searchResults.internships.length})
                    </Button>
                  )}
                </Box>
                <Grid container spacing={3}>
                  {searchResults.internships.slice(0, 3).map(internship => (
                    <Grid item xs={12} key={internship.id}>
                      <Card variant="outlined" sx={{ 
                        borderRadius: 2,
                        '&:hover': { boxShadow: 3, borderColor: 'primary.main' }
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="h6" component="div">
                              {internship.title}
                            </Typography>
                            <Chip 
                              label={internship.type} 
                              size="small" 
                              color={
                                internship.type === 'Remote' ? 'success' : 
                                internship.type === 'Hybrid' ? 'info' : 'default'
                              }
                            />
                          </Box>
                          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            {internship.company}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
                            <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2">
                              {internship.location}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Typography variant="body2" fontWeight="medium">
                              {internship.stipend} • {internship.duration}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {searchResults.projects.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <GroupIcon sx={{ mr: 1 }} /> Projects
                  </Typography>
                  {searchResults.projects.length > 2 && (
                    <Button 
                      component={RouterLink} 
                      to="#" 
                      onClick={() => setCategory('projects')}
                      size="small"
                    >
                      View all ({searchResults.projects.length})
                    </Button>
                  )}
                </Box>
                <Grid container spacing={3}>
                  {searchResults.projects.slice(0, 2).map(project => (
                    <Grid item xs={12} md={6} key={project.id}>
                      <Card variant="outlined" sx={{ 
                        borderRadius: 2,
                        height: '100%',
                        '&:hover': { boxShadow: 3, borderColor: 'primary.main' }
                      }}>
                        <CardContent>
                          <Typography variant="h6">
                            {project.title}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 1 }}>
                            <Chip label={project.status} size="small" color="primary" />
                            <Typography variant="body2">
                              {project.members} {project.members === 1 ? 'member' : 'members'}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {searchResults.discussions.length > 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <ForumIcon sx={{ mr: 1 }} /> Discussions
                  </Typography>
                  {searchResults.discussions.length > 2 && (
                    <Button 
                      component={RouterLink} 
                      to="#" 
                      onClick={() => setCategory('discussions')}
                      size="small"
                    >
                      View all ({searchResults.discussions.length})
                    </Button>
                  )}
                </Box>
                <Grid container spacing={3}>
                  {searchResults.discussions.slice(0, 2).map(discussion => (
                    <Grid item xs={12} key={discussion.id}>
                      <Card variant="outlined" sx={{ 
                        borderRadius: 2, 
                        p: 2,
                        '&:hover': { boxShadow: 3, borderColor: 'primary.main' }
                      }}>
                        <Typography variant="h6" component={RouterLink} to="/forum" sx={{ 
                          textDecoration: 'none', 
                          color: 'inherit',
                          '&:hover': { color: 'primary.main' }
                        }}>
                          {discussion.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {discussion.replies} {discussion.replies === 1 ? 'reply' : 'replies'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mx: 1 }}>
                            •
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {discussion.posted}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {getTotalResults() === 0 && searchQuery.length > 0 && !loading && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" gutterBottom>
                  No results found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  We couldn't find anything matching "{searchQuery}"
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Try different keywords or check your filters
                </Typography>
              </Box>
            )}
          </>
        );
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Search
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ position: 'relative' }}>
              <TextField
                fullWidth
                placeholder="Search for internships, projects, discussions..."
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchQuery ? (
                        <IconButton 
                          size="small" 
                          onClick={handleClearSearch}
                          edge="end"
                        >
                          <ClearIcon />
                        </IconButton>
                      ) : (
                        <IconButton 
                          size="small" 
                          onClick={() => setFilterOpen(!filterOpen)}
                          edge="end"
                        >
                          <TuneIcon />
                        </IconButton>
                      )}
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2, py: 0.5 }
                }}
              />
              {loading && (
                <CircularProgress 
                  size={24} 
                  sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    right: 50, 
                    marginTop: '-12px' 
                  }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
      
      {filterOpen && (
        <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="location-filter-label">Location</InputLabel>
                <Select
                  labelId="location-filter-label"
                  id="location-filter"
                  name="location"
                  value={filters.location}
                  label="Location"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Any location</MenuItem>
                  <MenuItem value="remote">Remote</MenuItem>
                  <MenuItem value="onsite">Onsite</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="type-filter-label">Type</InputLabel>
                <Select
                  labelId="type-filter-label"
                  id="type-filter"
                  name="type"
                  value={filters.type}
                  label="Type"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All types</MenuItem>
                  <MenuItem value="internship">Internship</MenuItem>
                  <MenuItem value="project">Project</MenuItem>
                  <MenuItem value="discussion">Discussion</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="duration-filter-label">Duration</InputLabel>
                <Select
                  labelId="duration-filter-label"
                  id="duration-filter"
                  name="duration"
                  value={filters.duration}
                  label="Duration"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Any duration</MenuItem>
                  <MenuItem value="3months">3 months</MenuItem>
                  <MenuItem value="6months">6 months</MenuItem>
                  <MenuItem value="1year">1 year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', height: '100%', alignItems: 'center' }}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => setFilters({
                    location: '',
                    type: '',
                    duration: '',
                    skills: []
                  })}
                  sx={{ mr: 1 }}
                >
                  Clear
                </Button>
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={handleSearch}
                >
                  Apply
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {(searchQuery.length > 0 || getTotalResults() > 0) && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs 
              value={category} 
              onChange={(_, newValue) => setCategory(newValue)}
              indicatorColor="primary"
              textColor="primary"
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons={isMobile ? "auto" : false}
            >
              <Tab 
                label={`All (${getTotalResults()})`} 
                value="all" 
                sx={{ fontWeight: 500 }}
              />
              <Tab 
                label={`Internships (${searchResults.internships.length})`} 
                value="internships" 
                sx={{ fontWeight: 500 }}
              />
              <Tab 
                label={`Projects (${searchResults.projects.length})`} 
                value="projects" 
                sx={{ fontWeight: 500 }}
              />
              <Tab 
                label={`Discussions (${searchResults.discussions.length})`} 
                value="discussions" 
                sx={{ fontWeight: 500 }}
              />
            </Tabs>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            renderTabContent()
          )}
        </>
      )}
      
      {searchQuery.length === 0 && getTotalResults() === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Search for opportunities
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Find internships, projects, and discussions to help advance your career
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try searching for a skill, company, or topic
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Search; 