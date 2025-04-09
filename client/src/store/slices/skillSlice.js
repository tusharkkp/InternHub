import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  skills: [],
  loading: false,
  error: null,
};

const skillSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    setSkills: (state, action) => {
      state.skills = action.payload;
    },
    addSkill: (state, action) => {
      state.skills.push(action.payload);
    },
    removeSkill: (state, action) => {
      state.skills = state.skills.filter(skill => skill.id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setSkills, addSkill, removeSkill, setLoading, setError } = skillSlice.actions;

export default skillSlice.reducer; 