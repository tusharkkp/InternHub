import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Mock data for testing and fallback
const mockInternships = [
  {
    id: '1',
    title: 'Frontend Developer Intern',
    company: 'TechCorp Inc.',
    status: 'Applied',
    applicationDate: '2023-11-15',
    logo: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '2',
    title: 'Data Science Intern',
    company: 'Analytics Plus',
    status: 'Under Review',
    applicationDate: '2023-11-10',
    logo: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '3',
    title: 'UX/UI Design Intern',
    company: 'Creative Solutions',
    status: 'Accepted',
    applicationDate: '2023-10-25',
    logo: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: '4',
    title: 'Backend Developer Intern',
    company: 'Server Systems',
    status: 'Rejected',
    applicationDate: '2023-10-05',
    logo: 'https://randomuser.me/api/portraits/women/4.jpg'
  }
];

const mockProjects = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'Building a modern e-commerce platform with React and Node.js',
    teamSize: 5,
    status: 'Active',
    image: 'https://source.unsplash.com/random/300x200/?ecommerce'
  },
  {
    id: '2',
    title: 'AI Chatbot',
    description: 'Developing an AI-powered chatbot for customer service',
    teamSize: 3,
    status: 'Planning',
    image: 'https://source.unsplash.com/random/300x200/?robot'
  },
  {
    id: '3',
    title: 'Mobile App Redesign',
    description: 'Redesigning the UI/UX for a fitness tracking mobile app',
    teamSize: 4,
    status: 'Active',
    image: 'https://source.unsplash.com/random/300x200/?mobile'
  }
];

// Async thunks for workspace data
export const fetchAppliedInternships = createAsyncThunk(
  'workspace/fetchAppliedInternships',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      console.log('Fetching applied internships with token:', token ? 'Token exists' : 'No token');
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };

      // Try to get data from API
      try {
        const res = await axios.get('/api/users/applied-internships', config);
        console.log('Applied internships response:', res.data);
        return res.data;
      } catch (apiError) {
        console.error('API error, using mock data:', apiError);
        // If API fails, return mock data for testing
        return mockInternships;
      }
    } catch (err) {
      console.error('Error fetching applied internships:', err);
      // Even if everything fails, return mock data as fallback
      return mockInternships;
    }
  }
);

export const fetchUserProjects = createAsyncThunk(
  'workspace/fetchUserProjects',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      console.log('Fetching user projects with token:', token ? 'Token exists' : 'No token');
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      // Try to get data from API
      try {
        const res = await axios.get('/api/users/my-projects', config);
        console.log('User projects response:', res.data);
        return res.data;
      } catch (apiError) {
        console.error('API error, using mock data:', apiError);
        // If API fails, return mock data for testing
        return mockProjects;
      }
    } catch (err) {
      console.error('Error fetching user projects:', err);
      // Even if everything fails, return mock data as fallback
      return mockProjects;
    }
  }
);

export const leaveProject = createAsyncThunk(
  'workspace/leaveProject',
  async (projectId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      await axios.post(`/api/projects/${projectId}/leave`, {}, config);
      return projectId;
    } catch (err) {
      console.error('Error leaving project:', err);
      return rejectWithValue(err.response?.data || { msg: 'Failed to leave project' });
    }
  }
);

export const deleteProject = createAsyncThunk(
  'workspace/deleteProject',
  async (projectId, { rejectWithValue, getState }) => {
    try {
      const token = getState().auth.token;
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      await axios.delete(`/api/projects/${projectId}`, config);
      console.log('Project deleted successfully:', projectId);
      return projectId;
    } catch (err) {
      console.error('Error deleting project:', err);
      return rejectWithValue(err.response?.data || { msg: 'Failed to delete project' });
    }
  }
);

// Initial state
const initialState = {
  appliedInternships: [],
  userProjects: [],
  loading: {
    internships: false,
    projects: false,
  },
  error: {
    internships: null,
    projects: null,
  }
};

// Create slice
const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    clearWorkspaceErrors: (state) => {
      state.error.internships = null;
      state.error.projects = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Applied Internships cases
      .addCase(fetchAppliedInternships.pending, (state) => {
        state.loading.internships = true;
        state.error.internships = null;
      })
      .addCase(fetchAppliedInternships.fulfilled, (state, action) => {
        state.loading.internships = false;
        state.appliedInternships = action.payload;
      })
      .addCase(fetchAppliedInternships.rejected, (state, action) => {
        state.loading.internships = false;
        state.error.internships = action.payload ? action.payload.msg : 'Failed to fetch applied internships';
      })
      
      // User Projects cases
      .addCase(fetchUserProjects.pending, (state) => {
        state.loading.projects = true;
        state.error.projects = null;
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.loading.projects = false;
        state.userProjects = action.payload;
      })
      .addCase(fetchUserProjects.rejected, (state, action) => {
        state.loading.projects = false;
        state.error.projects = action.payload ? action.payload.msg : 'Failed to fetch user projects';
      })
      
      // Leave Project cases
      .addCase(leaveProject.pending, (state) => {
        state.loading.projects = true;
      })
      .addCase(leaveProject.fulfilled, (state, action) => {
        state.loading.projects = false;
        state.userProjects = state.userProjects.filter(project => project.id !== action.payload);
      })
      .addCase(leaveProject.rejected, (state, action) => {
        state.loading.projects = false;
        state.error.projects = action.payload ? action.payload.msg : 'Failed to leave project';
      })
      
      // Delete Project cases
      .addCase(deleteProject.pending, (state) => {
        state.loading.projects = true;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading.projects = false;
        state.userProjects = state.userProjects.filter(project => project.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading.projects = false;
        state.error.projects = action.payload ? action.payload.msg : 'Failed to delete project';
      });
  }
});

export const { clearWorkspaceErrors } = workspaceSlice.actions;

export default workspaceSlice.reducer; 