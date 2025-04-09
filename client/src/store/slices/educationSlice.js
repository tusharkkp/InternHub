import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  education: [],
  loading: false,
  error: null,
};

const educationSlice = createSlice({
  name: 'education',
  initialState,
  reducers: {
    setEducation: (state, action) => {
      state.education = action.payload;
    },
    addEducation: (state, action) => {
      state.education.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setEducation, addEducation, setLoading, setError } = educationSlice.actions;

export default educationSlice.reducer; 