import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    loadUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loadUserSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
    },
    loadUserFailure: (state, action) => {
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
      state.error = action.payload;
    }
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  loadUserStart,
  loadUserSuccess,
  loadUserFailure
} = authSlice.actions;

// Load user from token (if exists)
export const loadUser = () => async (dispatch) => {
  if (!localStorage.getItem('token')) {
    // For development purposes, create a mock token
    const mockToken = 'mock-auth-token-for-development';
    localStorage.setItem('token', mockToken);
  }
  
  try {
    dispatch(loadUserStart());
    
    // In a real application, you would make an API call here to validate the token
    // and get the user data. For now, we'll simulate a successful response
    setTimeout(() => {
      const userData = {
        id: '102', // Match the owner ID in mock projects
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        skills: ['React', 'Redux', 'JavaScript', 'Node.js']
      };
      
      dispatch(loginSuccess({
        user: userData,
        token: localStorage.getItem('token')
      }));
      dispatch(loadUserSuccess(userData));
    }, 500);
  } catch (err) {
    dispatch(loadUserFailure(err.message || 'Failed to load user'));
  }
};

export default authSlice.reducer; 