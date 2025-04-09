import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Chip,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  ListItemText,
  OutlinedInput,
  Divider,
  Tooltip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  Collapse,
  Alert,
  AvatarGroup,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Psychology as PsychologyIcon,
  Person as PersonIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  LowPriority as LowPriorityIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  fetchProjectTasks,
  createTask,
  updateTask,
  deleteTask,
  assignTasksAI
} from '../../store/slices/taskSlice';

const priorityColors = {
  'High': 'error',
  'Medium': 'warning',
  'Low': 'success'
};

const statusColors = {
  'Not Started': 'default',
  'In Progress': 'primary',
  'Completed': 'success'
};

const statusIcons = {
  'Not Started': <RadioButtonUncheckedIcon fontSize="small" />,
  'In Progress': <AccessTimeIcon fontSize="small" />,
  'Completed': <CheckCircleIcon fontSize="small" />
};

const TaskList = ({ projectId, projectMembers, isOwner, personalTasks, isPersonalView = false }) => {
  const dispatch = useDispatch();
  const { projectTasks, loading, error, success } = useSelector(state => state.tasks);
  const user = useSelector(state => state.auth.user);
  
  // Force isOwner to true for debugging if not in personal view
  const effectiveIsOwner = !isPersonalView ? true : isOwner;
  
  // Use either personal tasks or project tasks
  const [tasks, setTasks] = useState([]);
  
  // States for create/edit task dialog
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    requiredSkills: [],
    priority: 'Medium',
    dueDate: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  
  // States for task menu
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  
  // States for filters and sorting
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // States for alerts
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  
  // Skills list for task creation
  const [availableSkills] = useState([
    'React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'TypeScript',
    'HTML', 'CSS', 'UI/UX', 'Frontend', 'Backend', 'API', 'Testing',
    'DevOps', 'Python', 'Java', 'C++', 'Mobile', 'Flutter', 'React Native',
    'Database', 'SQL', 'NoSQL', 'Cloud', 'AWS', 'Azure', 'Firebase',
    'Authentication', 'Payment Processing', 'Security', 'Performance'
  ]);
  
  useEffect(() => {
    console.log('TaskList mounted with props:', { 
      projectId, 
      isOwner: effectiveIsOwner,
      isPersonalView,
      personalTasks: personalTasks?.length || 0 
    });
    
    // Using different data source based on view mode
    if (isPersonalView && personalTasks) {
      setTasks(personalTasks);
    } else {
      // In project view, fetch project tasks
      dispatch(fetchProjectTasks(projectId));
    }
  }, [dispatch, projectId, isPersonalView, personalTasks, effectiveIsOwner]);
  
  // Update tasks when projectTasks changes
  useEffect(() => {
    if (!isPersonalView && projectTasks) {
      console.log('Updating tasks from projectTasks:', projectTasks.length);
      setTasks(projectTasks);
    }
  }, [isPersonalView, projectTasks]);
  
  useEffect(() => {
    if (success) {
      setAlertMessage(success);
      setAlertSeverity('success');
      setAlertOpen(true);
      
      // Auto-close alert after 5 seconds
      const timer = setTimeout(() => {
        setAlertOpen(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [success]);
  
  useEffect(() => {
    if (error) {
      setAlertMessage(error);
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  }, [error]);
  
  // Handle task menu open
  const handleTaskMenuOpen = (event, taskId) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
  };
  
  // Handle task menu close
  const handleTaskMenuClose = () => {
    setAnchorEl(null);
    setSelectedTaskId(null);
  };
  
  // Handle open task dialog
  const handleOpenTaskDialog = (isEdit = false, task = null) => {
    if (isEdit && task) {
      setIsEditMode(true);
      setEditTaskId(task.id);
      setTaskFormData({
        title: task.title,
        description: task.description,
        requiredSkills: task.requiredSkills || [],
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    } else {
      setIsEditMode(false);
      setEditTaskId(null);
      setTaskFormData({
        title: '',
        description: '',
        requiredSkills: [],
        priority: 'Medium',
        dueDate: ''
      });
    }
    setOpenTaskDialog(true);
    handleTaskMenuClose();
  };
  
  // Handle close task dialog
  const handleCloseTaskDialog = () => {
    setOpenTaskDialog(false);
    setTaskFormData({
      title: '',
      description: '',
      requiredSkills: [],
      priority: 'Medium',
      dueDate: ''
    });
  };
  
  // Handle task form change
  const handleTaskFormChange = (e) => {
    const { name, value } = e.target;
    setTaskFormData({
      ...taskFormData,
      [name]: value
    });
  };
  
  // Handle skills selection
  const handleSkillsChange = (event) => {
    const { value } = event.target;
    setTaskFormData({
      ...taskFormData,
      requiredSkills: typeof value === 'string' ? value.split(',') : value
    });
  };
  
  // Handle submit task form
  const handleSubmitTaskForm = () => {
    if (isEditMode) {
      dispatch(updateTask({
        taskId: editTaskId,
        taskData: {
          ...taskFormData,
          projectId
        }
      }));
    } else {
      dispatch(createTask({
        ...taskFormData,
        projectId
      }));
    }
    handleCloseTaskDialog();
  };
  
  // Handle delete task
  const handleDeleteTask = () => {
    if (selectedTaskId) {
      dispatch(deleteTask(selectedTaskId));
      handleTaskMenuClose();
    }
  };
  
  // Handle update task status
  const handleUpdateTaskStatus = (taskId, newStatus) => {
    dispatch(updateTask({
      taskId,
      taskData: { status: newStatus }
    }));
  };
  
  // Handle AI task assignment
  const handleAssignTasksAI = () => {
    console.log('Starting AI task assignment from TaskList');
    dispatch(assignTasksAI(projectId))
      .then((result) => {
        console.log('AI task assignment completed:', result);
        setAlertSeverity('success');
        setAlertMessage('Tasks have been auto-assigned based on team skills!');
        setAlertOpen(true);
      })
      .catch((error) => {
        console.error('Error in AI task assignment:', error);
        setAlertSeverity('error');
        setAlertMessage('Failed to auto-assign tasks. Please try again.');
        setAlertOpen(true);
      });
  };
  
  // Apply filters and sorting
  const getFilteredAndSortedTasks = () => {
    // First filter the tasks
    let filteredTasks = tasks ? [...tasks] : [];
    if (statusFilter !== 'All') {
      filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
    }
    
    // Then sort the tasks (create a new array to avoid mutating the original)
    return [...filteredTasks].sort((a, b) => {
      if (sortBy === 'dueDate') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'priority') {
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return sortDirection === 'asc' 
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === 'status') {
        const statusOrder = { 'Not Started': 0, 'In Progress': 1, 'Completed': 2 };
        return sortDirection === 'asc'
          ? statusOrder[a.status] - statusOrder[b.status]
          : statusOrder[b.status] - statusOrder[a.status];
      }
      return 0;
    });
  };
  
  // Calculate project completion percentage
  const calculateCompletionPercentage = () => {
    if (!tasks || tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.status === 'Completed').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };
  
  // Get completion color based on percentage
  const getCompletionColor = (percentage) => {
    if (percentage < 25) return 'error';
    if (percentage < 75) return 'warning';
    return 'success';
  };
  
  // Calculate user's personal tasks completion
  const calculatePersonalCompletion = () => {
    const userTasks = tasks.filter(task => 
      task.assignedTo && task.assignedTo.id === user?.id
    );
    
    if (userTasks.length === 0) return { total: 0, completed: 0, percentage: 0 };
    
    const completedTasks = userTasks.filter(task => task.status === 'Completed').length;
    const percentage = Math.round((completedTasks / userTasks.length) * 100);
    
    return { total: userTasks.length, completed: completedTasks, percentage };
  };
  
  // Task card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  const personalCompletion = calculatePersonalCompletion();
  const completionPercentage = calculateCompletionPercentage();
  const filteredAndSortedTasks = getFilteredAndSortedTasks();
  
  if (loading && (!tasks || tasks.length === 0)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography variant="body1">Loading tasks...</Typography>
      </Box>
    );
  }
  
  return (
    <Box sx={{ mt: 2 }}>
      {/* Alert for success/error messages */}
      <Collapse in={alertOpen}>
        <Alert
          severity={alertSeverity}
          action={
            <IconButton 
              size="small" 
              color="inherit" 
              onClick={() => setAlertOpen(false)}
            >
              <CancelIcon fontSize="small" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alertMessage}
        </Alert>
      </Collapse>
      
      {/* Project Progress Overview - only show in project mode */}
      {!isPersonalView && (
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Project Task Progress</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={completionPercentage} 
                    color={getCompletionColor(completionPercentage)}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {completionPercentage}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {tasks.filter(task => task.status === 'Completed').length} of {tasks.length} tasks completed
              </Typography>
            </Grid>
            
            {personalCompletion.total > 0 && (
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Your Tasks</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ flexGrow: 1, mr: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={personalCompletion.percentage} 
                      color={getCompletionColor(personalCompletion.percentage)}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {personalCompletion.percentage}%
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {personalCompletion.completed} of {personalCompletion.total} tasks completed
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}
      
      {/* Task Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          {effectiveIsOwner && !isPersonalView && (
            <>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenTaskDialog(false)}
                sx={{ mr: 1 }}
              >
                Add Task
              </Button>
              <Button 
                variant="outlined" 
                color="secondary"
                startIcon={<PsychologyIcon />}
                onClick={handleAssignTasksAI}
                sx={{ mr: 1, bgcolor: 'rgba(156, 39, 176, 0.08)' }}
              >
                <Box>
                  <Typography variant="button">Auto-Assign with AI</Typography>
                  <Typography variant="caption" sx={{ display: 'block', fontSize: '0.65rem' }}>
                    Match tasks to team skills
                  </Typography>
                </Box>
              </Button>
            </>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Not Started">Not Started</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
              startAdornment={
                <InputAdornment position="start">
                  <SortIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="dueDate">Due Date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>
          
          <IconButton 
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            color="primary"
            size="small"
            sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}
          >
            {sortDirection === 'asc' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>
      
      {/* Task List */}
      {filteredAndSortedTasks.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <AssignmentIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>No tasks found</Typography>
          <Typography variant="body2" color="text.secondary">
            {statusFilter !== 'All' 
              ? `No tasks with "${statusFilter}" status. Try changing the filter.` 
              : 'Start by adding your first task to this project.'}
          </Typography>
          {effectiveIsOwner && !isPersonalView && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => handleOpenTaskDialog(false)}
              sx={{ mt: 2 }}
            >
              Add First Task
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredAndSortedTasks.map((task, index) => (
            <Grid item xs={12} md={6} key={task.id}>
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  elevation={2} 
                  sx={{ 
                    position: 'relative',
                    borderLeft: '4px solid',
                    borderColor: task.status === 'Completed' 
                      ? 'success.main' 
                      : (statusColors[task.status] === 'primary' ? 'primary.main' : 'grey.400'),
                    '&:hover': {
                      boxShadow: 3
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" component="div" sx={{ mb: 1, pr: 4 }}>
                        {task.title}
                      </Typography>
                      {(effectiveIsOwner || (task.assignedTo && task.assignedTo.id === user?.id)) && (
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleTaskMenuOpen(e, task.id)}
                          sx={{ position: 'absolute', top: 8, right: 8 }}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      <Chip 
                        icon={statusIcons[task.status]} 
                        label={task.status} 
                        color={statusColors[task.status]} 
                        size="small" 
                        variant="outlined"
                      />
                      <Chip 
                        icon={<SpeedIcon fontSize="small" />} 
                        label={task.priority} 
                        color={priorityColors[task.priority]} 
                        size="small"
                        variant="outlined"
                      />
                      {task.dueDate && (
                        <Chip 
                          icon={<AccessTimeIcon fontSize="small" />}
                          label={new Date(task.dueDate).toLocaleDateString()}
                          size="small"
                          variant="outlined"
                          color={new Date(task.dueDate) < new Date() && task.status !== 'Completed' ? 'error' : 'default'}
                        />
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {task.description}
                    </Typography>
                    
                    {task.requiredSkills && task.requiredSkills.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Required Skills:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {task.requiredSkills.map(skill => (
                            <Chip 
                              key={skill} 
                              label={skill} 
                              size="small" 
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    {/* Show project info for personal view */}
                    {isPersonalView && task.project && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Project:
                        </Typography>
                        <Chip 
                          label={task.project.title} 
                          color="primary"
                          size="small"
                          component="a"
                          href={`/projects/${task.project.id}`}
                          clickable
                        />
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {task.assignedTo ? (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src={task.assignedTo.avatar} 
                            alt={task.assignedTo.name}
                            sx={{ width: 24, height: 24, mr: 1 }}
                          />
                          <Typography variant="body2">
                            {task.assignedTo.name}
                          </Typography>
                          {task.skillMatchPercentage > 0 && (
                            <Tooltip title="AI Skill Match: Higher percentage indicates better fit based on user skills">
                              <Chip 
                                label={`${Math.round(task.skillMatchPercentage)}% match`}
                                size="small"
                                color={task.skillMatchPercentage > 80 ? 'success' : (task.skillMatchPercentage > 50 ? 'warning' : 'default')}
                                sx={{ ml: 1, height: 20, '& .MuiChip-label': { px: 1, fontSize: '0.625rem' } }}
                                icon={<PsychologyIcon style={{ fontSize: '0.75rem' }} />}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Unassigned
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  
                  {(effectiveIsOwner || (task.assignedTo && task.assignedTo.id === user?.id)) && (
                    <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                      {task.status !== 'Completed' && (
                        <Button 
                          size="small" 
                          color="success" 
                          startIcon={<CheckCircleIcon />}
                          onClick={() => handleUpdateTaskStatus(task.id, 'Completed')}
                        >
                          Mark Complete
                        </Button>
                      )}
                      {task.status === 'Not Started' && (
                        <Button 
                          size="small" 
                          color="primary"
                          onClick={() => handleUpdateTaskStatus(task.id, 'In Progress')}
                        >
                          Start Task
                        </Button>
                      )}
                      {task.status === 'Completed' && (
                        <Button 
                          size="small" 
                          color="warning"
                          onClick={() => handleUpdateTaskStatus(task.id, 'In Progress')}
                        >
                          Reopen
                        </Button>
                      )}
                    </CardActions>
                  )}
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Task Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleTaskMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {effectiveIsOwner && !isPersonalView && (
          <MenuItem onClick={() => {
            const task = tasks.find(task => task.id === selectedTaskId);
            handleOpenTaskDialog(true, task);
          }}>
            <ListItemText>Edit Task</ListItemText>
          </MenuItem>
        )}
        {effectiveIsOwner && !isPersonalView && (
          <MenuItem onClick={handleDeleteTask}>
            <ListItemText>Delete Task</ListItemText>
          </MenuItem>
        )}
      </Menu>
      
      {/* Create/Edit Task Dialog */}
      <Dialog open={openTaskDialog} onClose={handleCloseTaskDialog} maxWidth="md" fullWidth>
        <DialogTitle>{isEditMode ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Task Title"
                fullWidth
                required
                value={taskFormData.title}
                onChange={handleTaskFormChange}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={taskFormData.description}
                onChange={handleTaskFormChange}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel id="required-skills-label">Required Skills</InputLabel>
                <Select
                  labelId="required-skills-label"
                  id="required-skills"
                  multiple
                  value={taskFormData.requiredSkills}
                  onChange={handleSkillsChange}
                  input={<OutlinedInput label="Required Skills" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableSkills.map((skill) => (
                    <MenuItem key={skill} value={skill}>
                      <ListItemText primary={skill} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  id="priority"
                  name="priority"
                  value={taskFormData.priority}
                  onChange={handleTaskFormChange}
                  label="Priority"
                >
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="dueDate"
                label="Due Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={taskFormData.dueDate}
                onChange={handleTaskFormChange}
                margin="normal"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTaskDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmitTaskForm} 
            variant="contained" 
            disabled={!taskFormData.title}
          >
            {isEditMode ? 'Save Changes' : 'Create Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskList; 