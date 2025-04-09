import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  personalityProfile: null,
  matchedProjects: [],
  matchedInternships: [],
  matchedTeammates: [],
  recommendedSkills: [],
  quizCompleted: false,
  loading: false,
  error: null
};

const personalitySlice = createSlice({
  name: 'personality',
  initialState,
  reducers: {
    setPersonalityProfile: (state, action) => {
      state.personalityProfile = action.payload;
      state.quizCompleted = true;
    },
    setMatchedProjects: (state, action) => {
      state.matchedProjects = action.payload;
    },
    setMatchedInternships: (state, action) => {
      state.matchedInternships = action.payload;
    },
    setMatchedTeammates: (state, action) => {
      state.matchedTeammates = action.payload;
    },
    setRecommendedSkills: (state, action) => {
      state.recommendedSkills = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetPersonality: (state) => {
      state.personalityProfile = null;
      state.quizCompleted = false;
    }
  }
});

export const {
  setPersonalityProfile,
  setMatchedProjects,
  setMatchedInternships,
  setMatchedTeammates,
  setRecommendedSkills,
  setLoading,
  setError,
  resetPersonality
} = personalitySlice.actions;

// Submit personality quiz answers and get results
export const submitPersonalityQuiz = (answers) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock result - in a real app, this would come from the backend
    const mockProfile = {
      type: "Innovator",
      traits: {
        creativity: 85,
        leadership: 70,
        teamwork: 65,
        problemSolving: 90,
        communication: 75
      },
      strengths: [
        "Creative thinking",
        "Problem solving",
        "Adapting to new situations"
      ],
      growthAreas: [
        "Delegation",
        "Long-term planning"
      ],
      description: "You're an innovative thinker who excels at finding creative solutions to complex problems. You prefer working in dynamic environments where you can explore new ideas and approaches."
    };
    
    dispatch(setPersonalityProfile(mockProfile));
    
    // Mock matched projects
    const mockProjects = [
      {
        id: "1",
        title: "AI-Powered Learning Platform",
        description: "Building an adaptive learning system that personalizes content based on user learning patterns.",
        matchScore: 95,
        skills: ["Machine Learning", "React", "Node.js"]
      },
      {
        id: "2",
        title: "Smart City Mobile App",
        description: "Developing an app that helps citizens navigate urban services and report issues.",
        matchScore: 88,
        skills: ["React Native", "UI/UX Design", "API Integration"]
      }
    ];
    
    dispatch(setMatchedProjects(mockProjects));
    
    // Mock matched internships
    const mockInternships = [
      {
        id: "1",
        title: "UX Research Intern",
        company: "DesignLab",
        location: "Remote",
        matchScore: 92,
        skills: ["User Research", "Prototyping", "Design Thinking"]
      },
      {
        id: "2",
        title: "Frontend Developer Intern",
        company: "TechStart Inc.",
        location: "New York, NY",
        matchScore: 90,
        skills: ["React", "JavaScript", "CSS"]
      }
    ];
    
    dispatch(setMatchedInternships(mockInternships));
    
    // Mock recommended skills
    const mockRecommendedSkills = [
      "Project Management",
      "UX/UI Design",
      "Data Visualization",
      "Public Speaking"
    ];
    
    dispatch(setRecommendedSkills(mockRecommendedSkills));
    
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message || 'Failed to process personality quiz'));
  }
};

export default personalitySlice.reducer; 