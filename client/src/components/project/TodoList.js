import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Checkbox,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Grid,
  Collapse,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Cancel as CancelIcon,
  Flag as FlagIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// This is a simplified todo model - in a real app, this would be in a Redux slice
const TodoList = ({ projectId }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  
  // Todo state
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem(`project_${projectId}_todos`);
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  
  // UI States
  const [newTodoText, setNewTodoText] = useState('');
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTodoText, setEditTodoText] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [completedFilter, setCompletedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  
  // Save todos to localStorage when they change
  useEffect(() => {
    localStorage.setItem(`project_${projectId}_todos`, JSON.stringify(todos));
  }, [todos, projectId]);
  
  // Handle adding a new todo
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;
    
    const newTodo = {
      id: Date.now(),
      text: newTodoText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      priority: 'medium',
      createdBy: {
        id: user?.id || 'anonymous',
        name: user?.name || 'Anonymous',
        avatar: user?.avatar || ''
      }
    };
    
    setTodos([...todos, newTodo]);
    setNewTodoText('');
    setAlert({
      open: true,
      message: 'Todo added successfully',
      severity: 'success'
    });
    
    setTimeout(() => {
      setAlert({ ...alert, open: false });
    }, 3000);
  };
  
  // Handle toggling a todo's completed status
  const handleToggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  // Handle deleting a todo
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    setAlert({
      open: true,
      message: 'Todo deleted successfully',
      severity: 'info'
    });
    
    setTimeout(() => {
      setAlert({ ...alert, open: false });
    }, 3000);
  };
  
  // Start editing a todo
  const handleStartEdit = (todo) => {
    setEditTodoId(todo.id);
    setEditTodoText(todo.text);
  };
  
  // Cancel editing a todo
  const handleCancelEdit = () => {
    setEditTodoId(null);
    setEditTodoText('');
  };
  
  // Save edited todo
  const handleSaveEdit = (id) => {
    if (!editTodoText.trim()) return;
    
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: editTodoText.trim() } : todo
    ));
    
    setEditTodoId(null);
    setEditTodoText('');
    setAlert({
      open: true,
      message: 'Todo updated successfully',
      severity: 'success'
    });
    
    setTimeout(() => {
      setAlert({ ...alert, open: false });
    }, 3000);
  };
  
  // Update todo priority
  const handleUpdatePriority = (id, priority) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, priority } : todo
    ));
  };
  
  // Handle drag and drop reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(filteredAndSortedTodos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Map back to the original todos array
    const todoIds = items.map(item => item.id);
    const newTodos = [];
    todoIds.forEach(id => {
      const todo = todos.find(t => t.id === id);
      if (todo) newTodos.push(todo);
    });
    
    // Add any todos that aren't in the filtered view
    todos.forEach(todo => {
      if (!todoIds.includes(todo.id)) {
        newTodos.push(todo);
      }
    });
    
    setTodos(newTodos);
  };
  
  // Filter and sort todos
  const filteredAndSortedTodos = todos
    .filter(todo => {
      // Filter by completion status
      if (completedFilter === 'completed' && !todo.completed) return false;
      if (completedFilter === 'active' && todo.completed) return false;
      
      // Filter by priority
      if (priorityFilter !== 'all' && todo.priority !== priorityFilter) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Sort by the selected field
      if (sortBy === 'createdAt') {
        return sortDirection === 'asc'
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'priority') {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return sortDirection === 'asc'
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return 0;
    });
  
  // Calculate completion percentage
  const calculateCompletionPercentage = () => {
    if (todos.length === 0) return 0;
    const completedCount = todos.filter(todo => todo.completed).length;
    return Math.round((completedCount / todos.length) * 100);
  };
  
  const completionPercentage = calculateCompletionPercentage();
  
  // Animation variants for list items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };
  
  // Map priority to colors
  const priorityColors = {
    high: 'error',
    medium: 'warning',
    low: 'success'
  };
  
  return (
    <Box sx={{ my: 2 }}>
      {/* Alert for notifications */}
      <Collapse in={alert.open}>
        <Alert
          severity={alert.severity}
          action={
            <IconButton 
              size="small" 
              color="inherit" 
              onClick={() => setAlert({ ...alert, open: false })}
            >
              <CancelIcon fontSize="small" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {alert.message}
        </Alert>
      </Collapse>
      
      {/* Todo Progress */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Personal To-Do List</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={completionPercentage} 
              sx={{ height: 10, borderRadius: 5 }}
              color={completionPercentage === 100 ? 'success' : 'primary'}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            {completionPercentage}%
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {todos.filter(todo => todo.completed).length} of {todos.length} todos completed
        </Typography>
      </Paper>
      
      {/* Add Todo Form */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <form onSubmit={handleAddTodo}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Add a new to-do item..."
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              variant="outlined"
            />
            <Button 
              type="submit" 
              variant="contained" 
              disabled={!newTodoText.trim()}
              startIcon={<AddIcon />}
            >
              Add
            </Button>
          </Box>
        </form>
      </Paper>
      
      {/* Filters and Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Box>
          <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
            <InputLabel id="completion-filter-label">Status</InputLabel>
            <Select
              labelId="completion-filter-label"
              id="completion-filter"
              value={completedFilter}
              onChange={(e) => setCompletedFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="priority-filter-label">Priority</InputLabel>
            <Select
              labelId="priority-filter-label"
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              label="Priority"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box>
          <FormControl size="small" sx={{ minWidth: 120, mr: 1 }}>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="createdAt">Date Added</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
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
      
      {/* Todo List */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {filteredAndSortedTodos.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <PlaylistAddCheckIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No to-do items found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {completedFilter === 'completed' 
                ? "You haven't completed any to-dos yet." 
                : completedFilter === 'active'
                ? "No active to-dos. Good job!"
                : "Start by adding your first to-do item."}
            </Typography>
          </Box>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="todos">
              {(provided) => (
                <List 
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{ p: 0 }}
                >
                  <AnimatePresence>
                    {filteredAndSortedTodos.map((todo, index) => (
                      <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                        {(provided) => (
                          <motion.div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            transition={{ delay: index * 0.05 }}
                          >
                            <ListItem
                              sx={{
                                bgcolor: todo.completed ? 'action.hover' : 'background.paper',
                                borderLeft: '4px solid',
                                borderColor: `${priorityColors[todo.priority]}.main`,
                                '&:hover': {
                                  bgcolor: 'action.hover',
                                },
                                px: 2,
                                py: 1
                              }}
                            >
                              <ListItemIcon>
                                <Checkbox
                                  edge="start"
                                  checked={todo.completed}
                                  onChange={() => handleToggleTodo(todo.id)}
                                  color="primary"
                                  icon={<CheckCircleOutlineIcon />}
                                  checkedIcon={<CheckCircleOutlineIcon />}
                                />
                              </ListItemIcon>
                              
                              {editTodoId === todo.id ? (
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={editTodoText}
                                  onChange={(e) => setEditTodoText(e.target.value)}
                                  autoFocus
                                  variant="outlined"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleSaveEdit(todo.id);
                                    }
                                  }}
                                />
                              ) : (
                                <ListItemText
                                  primary={
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        textDecoration: todo.completed ? 'line-through' : 'none',
                                        color: todo.completed ? 'text.secondary' : 'text.primary',
                                      }}
                                    >
                                      {todo.text}
                                    </Typography>
                                  }
                                  secondary={
                                    <Typography variant="caption" color="text.secondary">
                                      Added {new Date(todo.createdAt).toLocaleDateString()}
                                    </Typography>
                                  }
                                />
                              )}
                              
                              <ListItemSecondaryAction>
                                {editTodoId === todo.id ? (
                                  <>
                                    <IconButton 
                                      edge="end" 
                                      onClick={() => handleSaveEdit(todo.id)}
                                      color="primary"
                                      size="small"
                                    >
                                      <CheckCircleOutlineIcon />
                                    </IconButton>
                                    <IconButton 
                                      edge="end" 
                                      onClick={handleCancelEdit}
                                      size="small"
                                    >
                                      <CancelIcon />
                                    </IconButton>
                                  </>
                                ) : (
                                  <>
                                    <Tooltip title={`Priority: ${todo.priority}`}>
                                      <IconButton
                                        edge="end"
                                        onClick={(e) => {
                                          const priorities = ['high', 'medium', 'low'];
                                          const currentIndex = priorities.indexOf(todo.priority);
                                          const nextIndex = (currentIndex + 1) % priorities.length;
                                          handleUpdatePriority(todo.id, priorities[nextIndex]);
                                        }}
                                        color={priorityColors[todo.priority]}
                                        size="small"
                                      >
                                        <FlagIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <IconButton
                                      edge="end"
                                      onClick={() => handleStartEdit(todo)}
                                      size="small"
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton
                                      edge="end"
                                      onClick={() => handleDeleteTodo(todo.id)}
                                      color="error"
                                      size="small"
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </>
                                )}
                              </ListItemSecondaryAction>
                            </ListItem>
                            {index < filteredAndSortedTodos.length - 1 && <Divider />}
                          </motion.div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </AnimatePresence>
                </List>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Paper>
    </Box>
  );
};

export default TodoList; 