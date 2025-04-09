import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Tooltip,
  CircularProgress,
  Badge,
  Divider,
  Alert,
  Collapse
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccessTime as AccessTimeIcon,
  Flag as FlagIcon,
  Cancel as CancelIcon,
  CheckCircleOutline as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { updateTask, createTask, deleteTask } from '../../store/slices/taskSlice';

// Column backgrounds and colors
const COLUMN_COLORS = {
  'Not Started': {
    background: '#f5f5f5',
    color: '#424242',
    icon: <RadioButtonUncheckedIcon fontSize="small" />
  },
  'In Progress': {
    background: '#e3f2fd',
    color: '#1565c0',
    icon: <AccessTimeIcon fontSize="small" />
  },
  'Completed': {
    background: '#e8f5e9',
    color: '#2e7d32',
    icon: <CheckCircleIcon fontSize="small" />
  }
};

// Priority colors
const PRIORITY_COLORS = {
  'High': 'error',
  'Medium': 'warning',
  'Low': 'success'
};

const KanbanBoard = ({ projectId, isPersonalView, tasks, projectMembers, isOwner }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const { loading, error, success } = useSelector(state => state.tasks);
  
  // States
  const [columns, setColumns] = useState({
    'Not Started': [],
    'In Progress': [],
    'Completed': []
  });
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(null);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignedTo: ''
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  
  // Initialize columns with tasks
  useEffect(() => {
    if (tasks) {
      const newColumns = {
        'Not Started': [],
        'In Progress': [],
        'Completed': []
      };
      
      // Filter tasks for personal view or project view
      let filteredTasks = [...tasks];
      if (isPersonalView) {
        filteredTasks = filteredTasks.filter(task => 
          task.assignedTo && task.assignedTo.id === user?.id
        );
      }
      
      // Group tasks by status
      filteredTasks.forEach(task => {
        const status = task.status || 'Not Started';
        if (newColumns[status]) {
          newColumns[status].push(task);
        } else {
          newColumns['Not Started'].push(task);
        }
      });
      
      setColumns(newColumns);
    }
  }, [tasks, isPersonalView, user]);
  
  // Handle alerts
  useEffect(() => {
    if (success) {
      setAlertMessage(success);
      setAlertSeverity('success');
      setAlertOpen(true);
      
      const timer = setTimeout(() => setAlertOpen(false), 5000);
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
  
  // Handle drag and drop
  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    
    // If dropped outside a droppable area
    if (!destination) return;
    
    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    // Get the task
    const task = columns[source.droppableId][source.index];
    
    // Create a copy of the columns
    const newColumns = { ...columns };
    
    // Remove task from source column
    newColumns[source.droppableId].splice(source.index, 1);
    
    // Add task to destination column
    newColumns[destination.droppableId].splice(destination.index, 0, {
      ...task,
      status: destination.droppableId
    });
    
    // Update the columns
    setColumns(newColumns);
    
    // Update the task status in the backend
    dispatch(updateTask({
      taskId: task.id,
      taskData: { status: destination.droppableId }
    }));
  };
  
  // Handle open task dialog
  const handleOpenTaskDialog = (columnId, isEdit = false, task = null) => {
    setCurrentColumn(columnId);
    
    if (isEdit && task) {
      setIsEditMode(true);
      setEditTaskId(task.id);
      setTaskFormData({
        title: task.title,
        description: task.description || '',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        assignedTo: task.assignedTo ? task.assignedTo.id : ''
      });
    } else {
      setIsEditMode(false);
      setEditTaskId(null);
      setTaskFormData({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        assignedTo: ''
      });
    }
    
    setOpenTaskDialog(true);
  };
  
  // Handle close task dialog
  const handleCloseTaskDialog = () => {
    setOpenTaskDialog(false);
    setTaskFormData({
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: '',
      assignedTo: ''
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
  
  // Handle save task
  const handleSaveTask = () => {
    if (isEditMode) {
      dispatch(updateTask({
        taskId: editTaskId,
        taskData: {
          ...taskFormData,
          status: currentColumn
        }
      }));
    } else {
      dispatch(createTask({
        ...taskFormData,
        status: currentColumn,
        projectId
      }));
    }
    
    handleCloseTaskDialog();
  };
  
  // Handle delete task
  const handleDeleteTask = (taskId) => {
    dispatch(deleteTask(taskId));
  };
  
  // Calculate column statistics
  const getColumnStats = (columnId) => {
    const tasksInColumn = columns[columnId] || [];
    const totalTasks = tasksInColumn.length;
    
    // For completion column, calculate by percentage of total tasks
    if (columnId === 'Completed') {
      const allTasks = Object.values(columns).flat();
      const percentage = allTasks.length > 0 
        ? Math.round((totalTasks / allTasks.length) * 100) 
        : 0;
      
      return {
        total: totalTasks,
        percentage
      };
    }
    
    // Calculate high priority tasks
    const highPriorityTasks = tasksInColumn.filter(task => 
      task.priority === 'High'
    ).length;
    
    return {
      total: totalTasks,
      highPriority: highPriorityTasks
    };
  };
  
  // Render loading state
  if (loading && (!tasks || tasks.length === 0)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
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
    
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={2}>
          {Object.keys(columns).map(columnId => {
            const columnStats = getColumnStats(columnId);
            
            return (
              <Grid item xs={12} md={4} key={columnId}>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    backgroundColor: COLUMN_COLORS[columnId].background,
                    borderTop: '4px solid',
                    borderColor: COLUMN_COLORS[columnId].color,
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Column Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {COLUMN_COLORS[columnId].icon}
                      <Typography variant="h6" sx={{ color: COLUMN_COLORS[columnId].color, ml: 1 }}>
                        {columnId}
                      </Typography>
                      <Chip 
                        label={columnStats.total}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    
                    {/* Column stats */}
                    {columnId === 'Completed' ? (
                      <Tooltip title="Completion percentage">
                        <Chip 
                          label={`${columnStats.percentage}%`}
                          size="small"
                          color={columnStats.percentage > 50 ? 'success' : 'warning'}
                        />
                      </Tooltip>
                    ) : columnStats.highPriority > 0 && (
                      <Tooltip title="High priority tasks">
                        <Chip 
                          label={`${columnStats.highPriority} high priority`}
                          size="small"
                          color="error"
                        />
                      </Tooltip>
                    )}
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  {/* Add Task Button (except for completed column) */}
                  {columnId !== 'Completed' && (isOwner || !isPersonalView) && (
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenTaskDialog(columnId)}
                      sx={{ 
                        mb: 2, 
                        color: COLUMN_COLORS[columnId].color,
                        borderColor: COLUMN_COLORS[columnId].color,
                        '&:hover': {
                          backgroundColor: `${COLUMN_COLORS[columnId].color}10`
                        }
                      }}
                      fullWidth
                    >
                      Add Task
                    </Button>
                  )}
                  
                  {/* Droppable Column */}
                  <Droppable droppableId={columnId}>
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          minHeight: '50vh',
                          backgroundColor: snapshot.isDraggingOver ? `${COLUMN_COLORS[columnId].color}15` : 'transparent',
                          transition: 'background-color 0.2s ease',
                          borderRadius: '4px',
                          padding: '4px',
                          flexGrow: 1
                        }}
                      >
                        {/* Tasks */}
                        {columns[columnId].map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                sx={{
                                  mb: 2,
                                  backgroundColor: snapshot.isDragging ? '#ffffff' : '#ffffff',
                                  boxShadow: snapshot.isDragging ? 8 : 1,
                                  '&:hover': {
                                    boxShadow: 3
                                  },
                                  borderLeft: '4px solid',
                                  borderColor: task.priority ? 
                                    PRIORITY_COLORS[task.priority] === 'error' ? '#d32f2f' : 
                                    PRIORITY_COLORS[task.priority] === 'warning' ? '#ed6c02' : 
                                    '#2e7d32'
                                    : '#808080',
                                  position: 'relative'
                                }}
                              >
                                <CardContent>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                      {task.title}
                                    </Typography>
                                    
                                    <Box>
                                      {(isOwner || (task.assignedTo && task.assignedTo.id === user?.id)) && (
                                        <>
                                          <IconButton 
                                            size="small" 
                                            onClick={() => handleOpenTaskDialog(columnId, true, task)}
                                          >
                                            <EditIcon fontSize="small" />
                                          </IconButton>
                                          {isOwner && (
                                            <IconButton 
                                              size="small" 
                                              color="error"
                                              onClick={() => handleDeleteTask(task.id)}
                                            >
                                              <DeleteIcon fontSize="small" />
                                            </IconButton>
                                          )}
                                        </>
                                      )}
                                    </Box>
                                  </Box>
                                  
                                  {task.description && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                      {task.description.length > 100 
                                        ? `${task.description.substring(0, 100)}...` 
                                        : task.description}
                                    </Typography>
                                  )}
                                  
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                    {task.priority && (
                                      <Chip 
                                        icon={<FlagIcon fontSize="small" />}
                                        label={task.priority}
                                        size="small"
                                        color={PRIORITY_COLORS[task.priority]}
                                        variant="outlined"
                                      />
                                    )}
                                    
                                    {task.dueDate && (
                                      <Chip 
                                        icon={<AccessTimeIcon fontSize="small" />}
                                        label={new Date(task.dueDate).toLocaleDateString()}
                                        size="small"
                                        variant="outlined"
                                        color={new Date(task.dueDate) < new Date() && columnId !== 'Completed' ? 'error' : 'default'}
                                      />
                                    )}
                                  </Box>
                                  
                                  {task.requiredSkills && task.requiredSkills.length > 0 && (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                                      {task.requiredSkills.slice(0, 3).map(skill => (
                                        <Chip 
                                          key={skill}
                                          label={skill}
                                          size="small"
                                          variant="outlined"
                                        />
                                      ))}
                                      {task.requiredSkills.length > 3 && (
                                        <Chip 
                                          label={`+${task.requiredSkills.length - 3} more`}
                                          size="small"
                                        />
                                      )}
                                    </Box>
                                  )}
                                  
                                  {task.assignedTo && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                      <Avatar 
                                        src={task.assignedTo.avatar} 
                                        alt={task.assignedTo.name}
                                        sx={{ width: 24, height: 24, mr: 1 }}
                                      />
                                      <Typography variant="body2">
                                        {task.assignedTo.name}
                                      </Typography>
                                    </Box>
                                  )}
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                        {/* Empty state */}
                        {columns[columnId].length === 0 && (
                          <Box 
                            sx={{ 
                              textAlign: 'center', 
                              color: 'text.secondary',
                              p: 2,
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >
                            <Typography variant="body2" gutterBottom>
                              {columnId === 'Not Started' ? 'No tasks to start' : 
                               columnId === 'In Progress' ? 'No tasks in progress' :
                               'No completed tasks'}
                            </Typography>
                            {columnId !== 'Completed' && (isOwner || !isPersonalView) && (
                              <Button
                                variant="text"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenTaskDialog(columnId)}
                                size="small"
                              >
                                Add Task
                              </Button>
                            )}
                          </Box>
                        )}
                      </Box>
                    )}
                  </Droppable>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </DragDropContext>
      
      {/* Task Dialog */}
      <Dialog open={openTaskDialog} onClose={handleCloseTaskDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditMode ? 'Edit Task' : `Add Task to ${currentColumn}`}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                margin="normal"
                name="title"
                label="Task Title"
                type="text"
                fullWidth
                value={taskFormData.title}
                onChange={handleTaskFormChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                name="description"
                label="Description"
                multiline
                rows={3}
                fullWidth
                value={taskFormData.description}
                onChange={handleTaskFormChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
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
                margin="normal"
                name="dueDate"
                label="Due Date"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                value={taskFormData.dueDate}
                onChange={handleTaskFormChange}
              />
            </Grid>
            {projectMembers && projectMembers.length > 0 && (
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="assigned-to-label">Assign To</InputLabel>
                  <Select
                    labelId="assigned-to-label"
                    name="assignedTo"
                    value={taskFormData.assignedTo}
                    onChange={handleTaskFormChange}
                    label="Assign To"
                  >
                    <MenuItem value="">Unassigned</MenuItem>
                    {projectMembers.map(member => (
                      <MenuItem key={member.id} value={member.id}>
                        {member.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTaskDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveTask} 
            variant="contained"
            disabled={!taskFormData.title}
          >
            {isEditMode ? 'Save Changes' : 'Add Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KanbanBoard; 