import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Checkbox,
  TextField,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  Tooltip,
  CircularProgress,
  Collapse,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  PriorityHigh as PriorityHighIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
  Notifications as NotificationsIcon,
  CalendarToday as CalendarTodayIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { updateTask, createTask } from '../../store/slices/taskSlice';

const priorityColors = {
  'High': 'error',
  'Medium': 'warning',
  'Low': 'success'
};

const priorityIcons = {
  'High': <PriorityHighIcon fontSize="small" color="error" />,
  'Medium': <PriorityHighIcon fontSize="small" color="warning" />,
  'Low': <PriorityHighIcon fontSize="small" color="success" />
};

const TodoList = ({ projectId, isPersonalView, tasks, isOwner }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { loading, error, success } = useSelector(state => state.tasks);
  
  // States for create/edit task dialog
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    status: 'Not Started'
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  
  // Filter and sort states
  const [statusFilter, setStatusFilter] = useState('Active');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');
  
  // Alert states
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  // Get user assigned tasks or all project tasks for owner
  const getTasks = () => {
    if (!tasks) return [];
    
    let filteredTasks = [...tasks];
    
    // If not personal view and not owner, only show tasks assigned to user
    if (!isPersonalView && !isOwner) {
      filteredTasks = filteredTasks.filter(task => 
        task.assignedTo && task.assignedTo.id === user?.id
      );
    }
    
    // Filter by status
    if (statusFilter === 'Active') {
      filteredTasks = filteredTasks.filter(task => task.status !== 'Completed');
    } else if (statusFilter === 'Completed') {
      filteredTasks = filteredTasks.filter(task => task.status === 'Completed');
    }
    
    // Filter by priority
    if (priorityFilter !== 'All') {
      filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
    }
    
    // Sort tasks
    return filteredTasks.sort((a, b) => {
      if (sortBy === 'dueDate') {
        // Handle tasks without due dates (put them at the end)
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'priority') {
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };
  
  // Calculate completion percentage
  const calculateCompletionPercentage = () => {
    const allTasks = isPersonalView || !isOwner 
      ? tasks.filter(task => task.assignedTo && task.assignedTo.id === user?.id)
      : tasks;
      
    if (!allTasks || allTasks.length === 0) return 0;
    
    const completedTasks = allTasks.filter(task => task.status === 'Completed').length;
    return Math.round((completedTasks / allTasks.length) * 100);
  };
  
  // Handle task status toggle
  const handleToggleStatus = (taskId, currentStatus) => {
    dispatch(updateTask({
      taskId,
      taskData: {
        status: currentStatus === 'Completed' ? 'In Progress' : 'Completed'
      }
    }));
  };
  
  // Handle open task dialog
  const handleOpenTaskDialog = (isEdit = false, task = null) => {
    if (isEdit && task) {
      setIsEditMode(true);
      setEditTaskId(task.id);
      setNewTask({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : '',
        status: task.status || 'Not Started'
      });
    } else {
      setIsEditMode(false);
      setEditTaskId(null);
      setNewTask({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        status: 'Not Started'
      });
    }
    setOpenTaskDialog(true);
  };
  
  // Handle close task dialog
  const handleCloseTaskDialog = () => {
    setOpenTaskDialog(false);
  };
  
  // Handle task input change
  const handleTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle save task
  const handleSaveTask = () => {
    if (isEditMode) {
      dispatch(updateTask({
        taskId: editTaskId,
        taskData: newTask
      }));
    } else {
      dispatch(createTask({
        ...newTask,
        projectId
      }));
    }
    handleCloseTaskDialog();
  };
  
  // Handle alerts
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
  
  // Animation variants
  const listItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 }
  };
  
  // Get filtered and sorted tasks
  const filteredTasks = getTasks();
  const completionPercentage = calculateCompletionPercentage();
  
  // Group tasks by due date for better organization
  const groupTasksByDate = () => {
    const grouped = {};
    
    // Today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Tomorrow's date
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Tasks without due date go to "No Due Date" group
    filteredTasks.forEach(task => {
      let group = 'No Due Date';
      
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        
        // Check if due date is today
        if (dueDate.getTime() === today.getTime()) {
          group = 'Today';
        }
        // Check if due date is tomorrow
        else if (dueDate.getTime() === tomorrow.getTime()) {
          group = 'Tomorrow';
        }
        // Check if due date is in the past
        else if (dueDate < today) {
          group = 'Overdue';
        }
        // Check if due date is in the next 7 days
        else if (dueDate < new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) {
          group = 'This Week';
        }
        // Due date is further in the future
        else {
          group = 'Later';
        }
      }
      
      if (!grouped[group]) {
        grouped[group] = [];
      }
      
      grouped[group].push(task);
    });
    
    return grouped;
  };
  
  const groupedTasks = groupTasksByDate();
  
  // Order for date groups
  const groupOrder = ['Overdue', 'Today', 'Tomorrow', 'This Week', 'Later', 'No Due Date'];
  
  // If loading
  if (loading && (!tasks || tasks.length === 0)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
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
      
      {/* Progress Overview */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {isPersonalView ? 'Your To-Do Progress' : 'Project To-Do Progress'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ mr: 1, position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={completionPercentage}
                size={60}
                thickness={4}
                color={completionPercentage < 25 ? 'error' : (completionPercentage < 75 ? 'warning' : 'success')}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" component="div" color="text.secondary">
                  {`${completionPercentage}%`}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={completionPercentage} 
                sx={{ height: 10, borderRadius: 5 }}
                color={completionPercentage < 25 ? 'error' : (completionPercentage < 75 ? 'warning' : 'success')}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {getTasks().filter(task => task.status === 'Completed').length} of {getTasks().length} tasks completed
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Filter Controls */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl size="small" fullWidth>
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
                <MenuItem value="All">All Tasks</MenuItem>
                <MenuItem value="Active">Active Tasks</MenuItem>
                <MenuItem value="Completed">Completed Tasks</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl size="small" fullWidth>
              <InputLabel id="priority-filter-label">Priority</InputLabel>
              <Select
                labelId="priority-filter-label"
                id="priority-filter"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                label="Priority"
                startAdornment={
                  <InputAdornment position="start">
                    <FlagIcon fontSize="small" />
                  </InputAdornment>
                }
              >
                <MenuItem value="All">All Priorities</MenuItem>
                <MenuItem value="High">High Priority</MenuItem>
                <MenuItem value="Medium">Medium Priority</MenuItem>
                <MenuItem value="Low">Low Priority</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl size="small" fullWidth>
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
                <MenuItem value="title">Task Name</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Add Task Button */}
      <Box sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => handleOpenTaskDialog(false)}
          fullWidth
          sx={{ borderRadius: 2 }}
        >
          Add New To-Do Item
        </Button>
      </Box>
      
      {/* Task List Grouped by Due Date */}
      {filteredTasks.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>All caught up!</Typography>
          <Typography variant="body2" color="text.secondary">
            {statusFilter === 'Completed' 
              ? 'No completed tasks found. Mark some tasks as complete to see them here.'
              : statusFilter === 'Active'
                ? 'No active tasks found. Try adding a new task.'
                : 'No tasks found. Try adding your first task!'}
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenTaskDialog(false)}
            sx={{ mt: 2 }}
          >
            Add First Task
          </Button>
        </Paper>
      ) : (
        <AnimatePresence>
          {groupOrder.map(group => {
            if (!groupedTasks[group] || groupedTasks[group].length === 0) return null;
            
            return (
              <motion.div
                key={group}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card 
                  elevation={2} 
                  sx={{ 
                    mb: 2, 
                    borderRadius: 2,
                    borderLeft: '4px solid',
                    borderColor: group === 'Overdue' 
                      ? 'error.main' 
                      : group === 'Today' 
                        ? 'warning.main'
                        : group === 'Tomorrow'
                          ? 'info.main'
                          : 'primary.main'
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarTodayIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="h6">
                        {group}
                      </Typography>
                      <Chip 
                        label={`${groupedTasks[group].length} ${groupedTasks[group].length === 1 ? 'task' : 'tasks'}`} 
                        size="small" 
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    
                    <List disablePadding>
                      {groupedTasks[group].map((task, index) => (
                        <React.Fragment key={task.id}>
                          {index > 0 && <Divider component="li" />}
                          <motion.div
                            variants={listItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ delay: index * 0.05 }}
                          >
                            <ListItem 
                              sx={{ 
                                py: 1,
                                opacity: task.status === 'Completed' ? 0.7 : 1,
                                textDecoration: task.status === 'Completed' ? 'line-through' : 'none',
                              }}
                            >
                              <ListItemIcon>
                                <Checkbox
                                  edge="start"
                                  checked={task.status === 'Completed'}
                                  icon={<RadioButtonUncheckedIcon />}
                                  checkedIcon={<CheckCircleIcon />}
                                  onChange={() => handleToggleStatus(task.id, task.status)}
                                  color="success"
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={task.title}
                                secondary={
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                                    {priorityIcons[task.priority]}
                                    <Typography variant="body2" color="text.secondary" component="span">
                                      {task.priority} Priority
                                    </Typography>
                                    
                                    {task.dueDate && (
                                      <>
                                        <Typography variant="body2" color="text.secondary" component="span" sx={{ mx: 0.5 }}>•</Typography>
                                        <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                                        <Typography variant="body2" color="text.secondary" component="span">
                                          {format(new Date(task.dueDate), 'MMM d, yyyy')}
                                        </Typography>
                                      </>
                                    )}
                                    
                                    {/* Show project for personal view */}
                                    {isPersonalView && task.project && (
                                      <>
                                        <Typography variant="body2" color="text.secondary" component="span" sx={{ mx: 0.5 }}>•</Typography>
                                        <Chip 
                                          label={task.project.title}
                                          size="small"
                                          color="primary"
                                          sx={{ height: 20, '& .MuiChip-label': { px: 1, fontSize: '0.625rem' } }}
                                        />
                                      </>
                                    )}
                                  </Box>
                                }
                                primaryTypographyProps={{
                                  style: {
                                    fontWeight: task.status === 'Completed' ? 'normal' : 500,
                                    color: task.status === 'Completed' ? 'text.secondary' : 'text.primary'
                                  }
                                }}
                              />
                              <ListItemSecondaryAction>
                                <Tooltip title="Edit Task">
                                  <IconButton 
                                    edge="end" 
                                    size="small"
                                    onClick={() => handleOpenTaskDialog(true, task)}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </ListItemSecondaryAction>
                            </ListItem>
                          </motion.div>
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
      
      {/* Task Creation/Edit Dialog */}
      <Dialog open={openTaskDialog} onClose={handleCloseTaskDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditMode ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            name="title"
            label="Task Title"
            type="text"
            fullWidth
            variant="outlined"
            value={newTask.title}
            onChange={handleTaskInputChange}
            sx={{ mb: 2 }}
          />
          
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Description (Optional)"
            type="text"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newTask.description}
            onChange={handleTaskInputChange}
            sx={{ mb: 2 }}
          />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  id="priority"
                  name="priority"
                  value={newTask.priority}
                  onChange={handleTaskInputChange}
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
                margin="dense"
                id="dueDate"
                name="dueDate"
                label="Due Date"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                value={newTask.dueDate}
                onChange={handleTaskInputChange}
              />
            </Grid>
          </Grid>
          
          {isEditMode && (
            <FormControl fullWidth margin="dense" sx={{ mt: 2 }}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={newTask.status}
                onChange={handleTaskInputChange}
                label="Status"
              >
                <MenuItem value="Not Started">Not Started</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTaskDialog} startIcon={<CancelIcon />}>Cancel</Button>
          <Button 
            onClick={handleSaveTask} 
            color="primary" 
            variant="contained"
            disabled={!newTask.title.trim()}
            startIcon={<SaveIcon />}
          >
            {isEditMode ? 'Save Changes' : 'Add Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TodoList; 