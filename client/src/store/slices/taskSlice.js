import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { mockTasks, mockTeamMembers } from '../../utils/mockData';

// Mock data for testing and development
// const mockTasks = [
//   {
//     id: '1',
//     title: 'Design Login Page',
//     description: 'Create a modern login page with social login options',
//     status: 'In Progress',
//     priority: 'High',
//     requiredSkills: ['UI/UX', 'Frontend', 'React', 'Material UI'],
//     project: {
//       id: '1',
//       title: 'E-commerce Platform'
//     },
//     assignedTo: {
//       id: '101',
//       name: 'Jane Smith',
//       avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
//     },
//     createdBy: {
//       id: '102',
//       name: 'John Doe',
//       avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
//     },
//     skillMatchPercentage: 90,
//     dueDate: '2023-12-15',
//     completed: false,
//     createdAt: '2023-11-20'
//   },
//   {
//     id: '2',
//     title: 'Implement Payment Gateway',
//     description: 'Integrate Stripe payment processing',
//     status: 'Not Started',
//     priority: 'Medium',
//     requiredSkills: ['Backend', 'API', 'Node.js', 'Payment Processing'],
//     project: {
//       id: '1',
//       title: 'E-commerce Platform'
//     },
//     assignedTo: null,
//     createdBy: {
//       id: '102',
//       name: 'John Doe',
//       avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
//     },
//     skillMatchPercentage: 0,
//     dueDate: '2023-12-20',
//     completed: false,
//     createdAt: '2023-11-21'
//   },
//   {
//     id: '3',
//     title: 'Create Product List Component',
//     description: 'Build reusable product grid with filtering and sorting',
//     status: 'Completed',
//     priority: 'Medium',
//     requiredSkills: ['Frontend', 'React', 'Material UI', 'JavaScript'],
//     project: {
//       id: '1',
//       title: 'E-commerce Platform'
//     },
//     assignedTo: {
//       id: '101',
//       name: 'Jane Smith',
//       avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
//     },
//     createdBy: {
//       id: '102',
//       name: 'John Doe',
//       avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
//     },
//     skillMatchPercentage: 95,
//     dueDate: '2023-11-30',
//     completed: true,
//     createdAt: '2023-11-10'
//   },
//   {
//     id: '4',
//     title: 'Develop API Endpoints',
//     description: 'Create RESTful API endpoints for user management',
//     status: 'Not Started',
//     priority: 'High',
//     requiredSkills: ['Backend', 'API', 'Node.js', 'Express', 'MongoDB'],
//     project: {
//       id: '1',
//       title: 'E-commerce Platform'
//     },
//     assignedTo: null,
//     createdBy: {
//       id: '102',
//       name: 'John Doe',
//       avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
//     },
//     skillMatchPercentage: 0,
//     dueDate: '2023-12-25',
//     completed: false,
//     createdAt: '2023-11-22'
//   },
//   {
//     id: '5',
//     title: 'Implement Data Analytics Dashboard',
//     description: 'Create analytics dashboard with charts and filters',
//     status: 'Not Started',
//     priority: 'Medium',
//     requiredSkills: ['Data Analysis', 'Python', 'Visualization', 'Frontend'],
//     project: {
//       id: '1',
//       title: 'E-commerce Platform'
//     },
//     assignedTo: null,
//     createdBy: {
//       id: '102',
//       name: 'John Doe',
//       avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
//     },
//     skillMatchPercentage: 0,
//     dueDate: '2024-01-15',
//     completed: false,
//     createdAt: '2023-11-25'
//   }
// ];

// Get project tasks
export const fetchProjectTasks = createAsyncThunk(
  'tasks/fetchProjectTasks',
  async (projectId, { rejectWithValue, getState }) => {
    try {
      console.log('Fetching tasks for project ID:', projectId);
      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      try {
        const res = await axios.get(`/api/tasks/project/${projectId}`, config);
        console.log('Project tasks API response:', res.data);
        return res.data;
      } catch (apiError) {
        console.error('API error, using mock data:', apiError);
        
        // Generate unassigned tasks for the AI to assign
        const unassignedTasks = [
          {
            id: '2',
            title: 'Implement Payment Gateway',
            description: 'Integrate Stripe payment processing',
            status: 'Not Started',
            priority: 'Medium',
            requiredSkills: ['Backend', 'API', 'Node.js', 'Payment Processing'],
            project: {
              id: projectId,
              title: 'E-commerce Platform'
            },
            assignedTo: null,
            createdBy: {
              id: '102',
              name: 'John Doe',
              avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            skillMatchPercentage: 0,
            dueDate: '2023-12-20',
            completed: false,
            createdAt: '2023-11-21'
          },
          {
            id: '4',
            title: 'Develop API Endpoints',
            description: 'Create RESTful API endpoints for user management',
            status: 'Not Started',
            priority: 'High',
            requiredSkills: ['Backend', 'API', 'Node.js', 'Express', 'MongoDB'],
            project: {
              id: projectId,
              title: 'E-commerce Platform'
            },
            assignedTo: null,
            createdBy: {
              id: '102',
              name: 'John Doe',
              avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            skillMatchPercentage: 0,
            dueDate: '2023-12-25',
            completed: false,
            createdAt: '2023-11-22'
          },
          {
            id: '5',
            title: 'Implement Data Analytics Dashboard',
            description: 'Create analytics dashboard with charts and filters',
            status: 'Not Started',
            priority: 'Medium',
            requiredSkills: ['Data Analysis', 'Python', 'Visualization', 'Frontend'],
            project: {
              id: projectId,
              title: 'E-commerce Platform'
            },
            assignedTo: null,
            createdBy: {
              id: '102',
              name: 'John Doe',
              avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            skillMatchPercentage: 0,
            dueDate: '2024-01-15',
            completed: false,
            createdAt: '2023-11-25'
          }
        ];
        
        const assignedTasks = [
          {
            id: '1',
            title: 'Design Login Page',
            description: 'Create a modern login page with social login options',
            status: 'In Progress',
            priority: 'High',
            requiredSkills: ['UI/UX', 'Frontend', 'React', 'Material UI'],
            project: {
              id: projectId,
              title: 'E-commerce Platform'
            },
            assignedTo: {
              id: '101',
              name: 'Jane Smith',
              avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
            },
            createdBy: {
              id: '102',
              name: 'John Doe',
              avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            skillMatchPercentage: 90,
            dueDate: '2023-12-15',
            completed: false,
            createdAt: '2023-11-20'
          },
          {
            id: '3',
            title: 'Create Product List Component',
            description: 'Build reusable product grid with filtering and sorting',
            status: 'Completed',
            priority: 'Medium',
            requiredSkills: ['Frontend', 'React', 'Material UI', 'JavaScript'],
            project: {
              id: projectId,
              title: 'E-commerce Platform'
            },
            assignedTo: {
              id: '101',
              name: 'Jane Smith',
              avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
            },
            createdBy: {
              id: '102',
              name: 'John Doe',
              avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
            },
            skillMatchPercentage: 95,
            dueDate: '2023-11-30',
            completed: true,
            createdAt: '2023-11-10'
          }
        ];
        
        // Return a mix of assigned and unassigned tasks
        console.log('Returning mock tasks with unassigned tasks');
        return [...unassignedTasks, ...assignedTasks];
      }
    } catch (err) {
      console.error('Error fetching project tasks:', err);
      return rejectWithValue(err.response?.data?.msg || 'Failed to fetch tasks');
    }
  }
);

// Get user tasks
export const fetchUserTasks = createAsyncThunk(
  'tasks/fetchUserTasks',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      // Try to get data from API
      try {
        const res = await axios.get('/api/tasks/user', config);
        return res.data;
      } catch (apiError) {
        console.error('API error, using mock data:', apiError);
        // Mock user ID for testing
        const mockUserId = '101';
        return mockTasks.filter(task => task.assignedTo.id === mockUserId);
      }
    } catch (err) {
      console.error('Error fetching user tasks:', err);
      return rejectWithValue(err.response?.data || { msg: 'Failed to fetch tasks' });
    }
  }
);

// Create task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      const res = await axios.post('/api/tasks', taskData, config);
      return res.data;
    } catch (err) {
      console.error('Error creating task:', err);
      return rejectWithValue(err.response?.data || { msg: 'Failed to create task' });
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, taskData }, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      const res = await axios.put(`/api/tasks/${taskId}`, taskData, config);
      return res.data;
    } catch (err) {
      console.error('Error updating task:', err);
      return rejectWithValue(err.response?.data || { msg: 'Failed to update task' });
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      await axios.delete(`/api/tasks/${taskId}`, config);
      return taskId;
    } catch (err) {
      console.error('Error deleting task:', err);
      return rejectWithValue(err.response?.data || { msg: 'Failed to delete task' });
    }
  }
);

// AI assign tasks
export const assignTasksAI = createAsyncThunk(
  'tasks/assignTasksAI',
  async (projectId, { rejectWithValue, getState, dispatch }) => {
    try {
      console.log('Starting AI task assignment for project:', projectId);
      const token = getState().auth.token;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      try {
        const res = await axios.post(`/api/tasks/assign-ai/${projectId}`, {}, config);
        console.log('API call successful:', res.data);
        return res.data;
      } catch (apiError) {
        console.error('API error, using mock data for AI assignment:', apiError);
        
        // Mock implementation of AI assignment logic for demo
        const { projectTasks } = getState().tasks;
        console.log('Using mock implementation with', projectTasks.length, 'tasks');
        
        // Function to calculate skill match percentage
        const calculateSkillMatch = (taskSkills, memberSkills) => {
          if (!taskSkills || taskSkills.length === 0 || !memberSkills || memberSkills.length === 0) {
            return 0;
          }
          
          const matchingSkills = taskSkills.filter(skill => memberSkills.includes(skill));
          return (matchingSkills.length / taskSkills.length) * 100;
        };
        
        // Assign tasks to team members based on skill match
        const updatedTasks = projectTasks.map(task => {
          // Skip already completed tasks
          if (task.status === 'Completed') {
            return task;
          }
          
          // Calculate skill match for each team member
          const matches = mockTeamMembers.map(member => ({
            member,
            matchPercentage: calculateSkillMatch(task.requiredSkills, member.skills)
          }));
          
          // Sort by match percentage (descending)
          matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
          
          // Assign to the best match
          const bestMatch = matches[0];
          
          return {
            ...task,
            assignedTo: bestMatch.member,
            skillMatchPercentage: bestMatch.matchPercentage
          };
        });
        
        console.log('Task assignment completed', updatedTasks);
        
        // Update each task in the state
        for (const task of updatedTasks) {
          dispatch(updateTask({
            taskId: task.id,
            taskData: {
              assignedTo: task.assignedTo,
              skillMatchPercentage: task.skillMatchPercentage
            }
          }));
        }
        
        return { 
          msg: 'Tasks have been auto-assigned based on team skills',
          updatedTasks 
        };
      }
    } catch (err) {
      console.error('Error in AI task assignment:', err);
      return rejectWithValue(err.response?.data?.msg || 'Failed to assign tasks');
    }
  }
);

// Initial state
const initialState = {
  projectTasks: [],
  userTasks: [],
  currentTask: null,
  loading: false,
  error: null,
  success: null
};

// Create slice
const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskErrors: (state) => {
      state.error = null;
    },
    clearTaskSuccess: (state) => {
      state.success = null;
    },
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Project Tasks
      .addCase(fetchProjectTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.projectTasks = action.payload;
      })
      .addCase(fetchProjectTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || 'Failed to fetch project tasks';
      })
      
      // Fetch User Tasks
      .addCase(fetchUserTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.userTasks = action.payload;
      })
      .addCase(fetchUserTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || 'Failed to fetch user tasks';
      })
      
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.projectTasks = [action.payload, ...state.projectTasks];
        state.success = 'Task created successfully';
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || 'Failed to create task';
      })
      
      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        // Update in projectTasks
        state.projectTasks = state.projectTasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        );
        // Update in userTasks if present
        state.userTasks = state.userTasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        );
        state.success = 'Task updated successfully';
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || 'Failed to update task';
      })
      
      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.projectTasks = state.projectTasks.filter(task => task.id !== action.payload);
        state.userTasks = state.userTasks.filter(task => task.id !== action.payload);
        state.success = 'Task deleted successfully';
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || 'Failed to delete task';
      })
      
      // AI Assign Tasks
      .addCase(assignTasksAI.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(assignTasksAI.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload?.msg || 'Tasks have been auto-assigned';
        
        // If we get updated tasks directly, update them in the state
        if (action.payload?.updatedTasks) {
          state.projectTasks = action.payload.updatedTasks;
        }
      })
      .addCase(assignTasksAI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.msg || 'Failed to auto-assign tasks';
      });
  }
});

export const { clearTaskErrors, clearTaskSuccess, setCurrentTask } = taskSlice.actions;

export default taskSlice.reducer; 