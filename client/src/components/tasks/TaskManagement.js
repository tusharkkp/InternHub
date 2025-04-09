import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  LinearProgress,
  IconButton
} from '@mui/material';
import {
  ViewList as ViewListIcon,
  ViewKanban as ViewKanbanIcon,
  FormatListBulleted as TodoIcon,
  Assignment as TaskIcon,
  Analytics as AnalyticsIcon,
  Psychology as PsychologyIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import TaskList from '../project/TaskList';
import KanbanBoard from './KanbanBoard';
import TodoList from './TodoList';
import { fetchProjectTasks, fetchUserTasks, assignTasksAI } from '../../store/slices/taskSlice';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`task-tabpanel-${index}`}
      aria-labelledby={`task-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0, pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Props for accessibility
function a11yProps(index) {
  return {
    id: `task-tab-${index}`,
    'aria-controls': `task-tabpanel-${index}`,
  };
}

const TaskManagement = ({ projectId, projectMembers, isOwner, isPersonalView = false }) => {
  const dispatch = useDispatch();
  const { projectTasks, userTasks, loading } = useSelector(state => state.tasks);
  const [tabValue, setTabValue] = useState(0);
  const [aiResultsOpen, setAiResultsOpen] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [showAiHighlight, setShowAiHighlight] = useState(true);
  
  // Force isOwner to true for debugging if viewing a project
  const effectiveIsOwner = !isPersonalView ? true : isOwner;
  
  console.log('TaskManagement mounted with props:', {
    projectId,
    isOwner: effectiveIsOwner,
    isPersonalView,
    showAiHighlight
  });
  
  // Use either project tasks or user tasks based on view mode
  const tasks = isPersonalView ? userTasks : projectTasks;
  
  useEffect(() => {
    // Fetch appropriate tasks based on view mode
    if (isPersonalView) {
      dispatch(fetchUserTasks());
    } else if (projectId) {
      dispatch(fetchProjectTasks(projectId));
    }
  }, [dispatch, projectId, isPersonalView]);
  
  // Calculate task statistics
  const calculateTaskStats = () => {
    if (!tasks || tasks.length === 0) return { total: 0, notStarted: 0, inProgress: 0, completed: 0 };
    
    const stats = {
      total: tasks.length,
      notStarted: tasks.filter(task => task.status === 'Not Started').length,
      inProgress: tasks.filter(task => task.status === 'In Progress').length,
      completed: tasks.filter(task => task.status === 'Completed').length
    };
    
    // Calculate percentages
    stats.completionPercentage = Math.round((stats.completed / stats.total) * 100);
    stats.inProgressPercentage = Math.round((stats.inProgress / stats.total) * 100);
    
    return stats;
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Handle AI task assignment (for project owners only)
  const handleAssignTasksAI = () => {
    dispatch(assignTasksAI(projectId))
      .then((result) => {
        if (result.payload?.updatedTasks) {
          // Prepare results for display
          const assignmentResults = result.payload.updatedTasks
            .filter(task => task.status !== 'Completed' && task.assignedTo)
            .map(task => ({
              taskId: task.id,
              taskTitle: task.title,
              assignedTo: task.assignedTo,
              requiredSkills: task.requiredSkills,
              skillMatchPercentage: task.skillMatchPercentage
            }));
          
          setAiResults(assignmentResults);
          setAiResultsOpen(true);
        }
      })
      .catch((error) => {
        console.error("Error in AI task assignment:", error);
      });
  };
  
  const taskStats = calculateTaskStats();
  
  // Loading state
  if (loading && (!tasks || tasks.length === 0)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Debug information */}
      {console.log('TaskManagement Debug:', {
        isOwner: effectiveIsOwner,
        isPersonalView,
        showAiHighlight,
        projectTasks,
        unassignedTasks: projectTasks ? projectTasks.filter(t => !t.assignedTo).length : 0
      })}
      
      {/* AI Task Allocation Banner for first-time owners */}
      {effectiveIsOwner && !isPersonalView && showAiHighlight && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            mb: 3, 
            borderRadius: 2,
            background: 'linear-gradient(to right, rgba(156, 39, 176, 0.1), rgba(156, 39, 176, 0.05))',
            border: '1px solid rgba(156, 39, 176, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PsychologyIcon color="secondary" sx={{ fontSize: 36, mr: 2 }} />
            <Box>
              <Typography variant="h6" gutterBottom>Smart AI Task Allocation Available</Typography>
              <Typography variant="body2">
                AI can automatically match tasks to team members based on their skills to maximize productivity and team satisfaction.
              </Typography>
            </Box>
          </Box>
          <Box>
            <Button 
              variant="contained" 
              color="secondary"
              onClick={handleAssignTasksAI}
              startIcon={<PsychologyIcon />}
              sx={{ mr: 1 }}
            >
              Auto-Assign Tasks
            </Button>
            <IconButton onClick={() => setShowAiHighlight(false)} size="small">
              <CancelIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      )}
      
      {/* Task Statistics Overview */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={effectiveIsOwner && !isPersonalView ? 8 : 12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              {isPersonalView ? 'Your Task Overview' : 'Project Task Overview'}
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6} sm={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', py: 1, '&:last-child': { pb: 1 } }}>
                    <Typography variant="h4" color="text.secondary">
                      {taskStats.total}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Tasks
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Card variant="outlined" sx={{ borderColor: '#ef5350' }}>
                  <CardContent sx={{ textAlign: 'center', py: 1, '&:last-child': { pb: 1 } }}>
                    <Typography variant="h4" sx={{ color: '#ef5350' }}>
                      {taskStats.notStarted}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Not Started
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Card variant="outlined" sx={{ borderColor: '#2196f3' }}>
                  <CardContent sx={{ textAlign: 'center', py: 1, '&:last-child': { pb: 1 } }}>
                    <Typography variant="h4" sx={{ color: '#2196f3' }}>
                      {taskStats.inProgress}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      In Progress
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={6} sm={3}>
                <Card variant="outlined" sx={{ borderColor: '#4caf50' }}>
                  <CardContent sx={{ textAlign: 'center', py: 1, '&:last-child': { pb: 1 } }}>
                    <Typography variant="h4" sx={{ color: '#4caf50' }}>
                      {taskStats.completed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: '100%', mr: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>Completion:</Typography>
                  <Box sx={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 5, height: 8 }}>
                    <Box
                      sx={{
                        width: `${taskStats.completionPercentage}%`,
                        backgroundColor: '#4caf50',
                        height: 8,
                        borderRadius: 5,
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ ml: 1 }}>{taskStats.completionPercentage}%</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>In Progress:</Typography>
                  <Box sx={{ width: '100%', backgroundColor: '#e0e0e0', borderRadius: 5, height: 8 }}>
                    <Box
                      sx={{
                        width: `${taskStats.inProgressPercentage}%`,
                        backgroundColor: '#2196f3',
                        height: 8,
                        borderRadius: 5,
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ ml: 1 }}>{taskStats.inProgressPercentage}%</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* AI Task Assignment for project owners */}
        {effectiveIsOwner && !isPersonalView && (
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={2} 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                backgroundColor: 'rgba(156, 39, 176, 0.05)',
                border: '1px dashed rgba(156, 39, 176, 0.5)'
              }}
            >
              <PsychologyIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
              <Typography variant="h6" align="center" gutterBottom>
                Smart AI Task Assignment
              </Typography>
              <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 2 }}>
                Our AI analyzes team members' skills and task requirements to optimally assign tasks. This improves productivity by matching people with work that aligns with their abilities.
              </Typography>
              <Box sx={{ width: '100%' }}>
                <Button 
                  variant="contained" 
                  color="secondary"
                  startIcon={<PsychologyIcon />}
                  onClick={handleAssignTasksAI}
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  Auto-Assign Tasks
                </Button>
                <Typography variant="caption" display="block" align="center" color="text.secondary">
                  Each task will show a match percentage indicating compatibility with the assigned user's skills
                </Typography>
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>
      
      {/* Task Management Tabs */}
      <Paper elevation={2} sx={{ borderRadius: 2 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            icon={<ViewListIcon />} 
            label="List View" 
            {...a11yProps(0)} 
          />
          <Tab 
            icon={<ViewKanbanIcon />} 
            label="Kanban Board" 
            {...a11yProps(1)} 
          />
          <Tab 
            icon={<TodoIcon />} 
            label="To-Do List" 
            {...a11yProps(2)} 
          />
          {!isPersonalView && (
            <Tab 
              icon={<AnalyticsIcon />} 
              label="Analytics" 
              {...a11yProps(3)} 
              disabled
            />
          )}
        </Tabs>
        
        {/* List View */}
        <TabPanel value={tabValue} index={0}>
          <TaskList 
            projectId={projectId} 
            projectMembers={projectMembers} 
            isOwner={effectiveIsOwner}
            personalTasks={userTasks}
            isPersonalView={isPersonalView}
          />
        </TabPanel>
        
        {/* Kanban Board */}
        <TabPanel value={tabValue} index={1}>
          <KanbanBoard 
            projectId={projectId}
            isPersonalView={isPersonalView}
            tasks={tasks}
            projectMembers={projectMembers}
            isOwner={effectiveIsOwner}
          />
        </TabPanel>
        
        {/* To-Do List */}
        <TabPanel value={tabValue} index={2}>
          <TodoList 
            projectId={projectId}
            isPersonalView={isPersonalView}
            tasks={tasks}
            isOwner={effectiveIsOwner}
          />
        </TabPanel>
        
        {/* Analytics (placeholder for future) */}
        {!isPersonalView && (
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <AnalyticsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Task Analytics Coming Soon</Typography>
              <Typography variant="body2" color="text.secondary">
                Detailed analytics, trends, and insights about your project tasks will be available in future updates.
              </Typography>
            </Box>
          </TabPanel>
        )}
      </Paper>
      
      {/* AI Task Assignment Results Dialog */}
      <Dialog 
        open={aiResultsOpen} 
        onClose={() => setAiResultsOpen(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PsychologyIcon sx={{ mr: 1, color: 'secondary.main' }} />
            AI Task Assignment Results
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" paragraph>
            Our AI has analyzed team members' skills and assigned tasks based on the best skill matches. 
            Here are the results of the automatic assignment:
          </Typography>
          
          <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Task</TableCell>
                  <TableCell>Required Skills</TableCell>
                  <TableCell>Assigned To</TableCell>
                  <TableCell align="right">Skill Match</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {aiResults.map((result) => (
                  <TableRow key={result.taskId}>
                    <TableCell>{result.taskTitle}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {result.requiredSkills?.map((skill) => (
                          <Chip key={skill} label={skill} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={result.assignedTo.avatar}
                          alt={result.assignedTo.name}
                          sx={{ width: 24, height: 24, mr: 1 }}
                        />
                        <Typography variant="body2">
                          {result.assignedTo.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Box sx={{ width: 100, mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={result.skillMatchPercentage} 
                            color={
                              result.skillMatchPercentage > 80 ? 'success' : 
                              result.skillMatchPercentage > 50 ? 'warning' : 
                              'error'
                            }
                          />
                        </Box>
                        <Typography variant="body2">
                          {Math.round(result.skillMatchPercentage)}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Typography variant="body2" sx={{ mt: 2 }}>
            <strong>How it works:</strong> The AI analyzes each task's required skills and compares them with team members' skillsets. 
            It then calculates a match percentage and assigns tasks to team members with the best matching skills.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiResultsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskManagement; 