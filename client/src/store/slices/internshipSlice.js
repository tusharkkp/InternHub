import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  internships: [],
  loading: false,
  error: null,
  appliedInternships: [],
};

const internshipSlice = createSlice({
  name: 'internships',
  initialState,
  reducers: {
    setInternships: (state, action) => {
      state.internships = action.payload;
    },
    addInternship: (state, action) => {
      state.internships.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    applyToInternship: (state, action) => {
      // Check if already applied
      if (!state.appliedInternships.includes(action.payload)) {
        state.appliedInternships.push(action.payload);
      }
    },
    removeApplication: (state, action) => {
      state.appliedInternships = state.appliedInternships.filter(
        id => id !== action.payload
      );
    },
  },
});

export const { 
  setInternships, 
  addInternship, 
  setLoading, 
  setError,
  applyToInternship,
  removeApplication 
} = internshipSlice.actions;

export default internshipSlice.reducer; 