import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  messages: [],
  loading: false,
  error: null
};

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    toggleChatbot: (state) => {
      state.isOpen = !state.isOpen;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearMessages: (state) => {
      state.messages = [];
    }
  }
});

export const {
  toggleChatbot,
  addMessage,
  setLoading,
  setError,
  clearMessages
} = chatbotSlice.actions;

// Website features knowledge base
const websiteFeatures = {
  homepage: {
    name: "Homepage",
    description: "The main landing page with an overview of the platform.",
    path: "/"
  },
  internships: {
    name: "Internships",
    description: "Browse and apply for internship opportunities matching your skills.",
    path: "/internships",
    actions: ["browse", "apply", "filter by skills"]
  },
  projects: {
    name: "Projects",
    description: "Discover collaborative projects or create your own project team.",
    path: "/projects",
    actions: ["browse", "join", "create new", "filter by requirements"]
  },
  workspace: {
    name: "My Workspace",
    description: "Your personal dashboard to track applications, joined projects, and tasks.",
    path: "/workspace",
    sections: ["Applications", "My Projects", "Tasks", "Analytics"]
  },
  profile: {
    name: "Profile",
    description: "Your professional profile showcasing skills, experience, and accomplishments.",
    path: "/profile",
    sections: ["Overview", "Skills Dashboard", "Portfolio", "Learning Path", "Skill Assessment", "Career Dashboard"]
  },
  careerDashboard: {
    name: "Career Dashboard",
    description: "Track your career progress, application status, and skill development.",
    path: "/profile",
    tab: 5,
    features: ["Progress Tracking", "Application Tracker", "Recommended Paths", "Skill Gaps Analysis", "Achievements Tracking"]
  },
  aiMatching: {
    name: "AI Teammate Matching",
    description: "Get AI-powered recommendations for teammates based on project requirements and skills.",
    path: "/projects/matching"
  },
  learning: {
    name: "Learning Path",
    description: "Personalized learning roadmap based on your career goals and skill gaps.",
    path: "/profile",
    tab: 3
  }
};

// Common user queries and their responses
const commonQueries = {
  "how to apply for internship": 
    "To apply for an internship: \n1. Navigate to the Internships section \n2. Browse available internships or filter by your skills \n3. Click on any internship card to view details \n4. Click the 'Apply' button on the internship detail page \n5. Complete the application form \n6. Track your application status in My Workspace",
  
  "find projects": 
    "To find projects: \n1. Go to the Projects section \n2. Browse available projects or use filters to narrow your search \n3. Click on project cards to view details including required skills and team members \n4. Use the 'Join Project' button to express interest",
  
  "track applications": 
    "You can track all your internship applications in My Workspace. The application tracker shows the status (Applied, In Review, Interview Scheduled, Selected, or Rejected) along with application dates and company details.",
  
  "edit profile": 
    "To update your profile: \n1. Navigate to the Profile page \n2. Click the 'Edit Profile' button \n3. Update your information in the form fields \n4. Add skills, experiences, and projects \n5. Click 'Save Changes' when finished",
  
  "ai teammate matching": 
    "The AI teammate matching feature helps you find the right collaborators for your projects. When creating or managing a project, you can use the 'Find Teammates' option to get AI-powered recommendations based on required skills and project goals.",
  
  "career dashboard": 
    "The Career Dashboard in your Profile section helps you track your professional growth. It includes: \n• Career progress overview \n• Application tracking \n• Recommended career paths \n• Skill gaps analysis \n• Achievements and certifications \n• Career insights and analytics",
  
  "learning path": 
    "Your personalized Learning Path is available in the Profile section. It provides tailored recommendations for courses, resources, and skills to develop based on your career goals and current skill set.",
  
  "skill assessment": 
    "The Skill Assessment feature in your Profile helps you evaluate your current proficiency levels across various technical and soft skills. It generates a visual radar chart and suggests areas for improvement."
};

// Helper function to find the most relevant response to a query
function findRelevantResponse(query) {
  // Normalize the query
  const normalizedQuery = query.toLowerCase().trim();
  
  // Check for direct matches in common queries
  for (const [key, response] of Object.entries(commonQueries)) {
    if (normalizedQuery.includes(key)) {
      return response;
    }
  }
  
  // Handle navigation questions
  if (normalizedQuery.includes("where") || normalizedQuery.includes("how to find") || normalizedQuery.includes("navigate to")) {
    for (const [key, feature] of Object.entries(websiteFeatures)) {
      if (normalizedQuery.includes(key) || 
          normalizedQuery.includes(feature.name.toLowerCase())) {
        return `You can find ${feature.name} at ${feature.path}${feature.tab ? ' (tab #' + (feature.tab + 1) + ')' : ''}. ${feature.description}`;
      }
    }
  }
  
  // Handle general help request
  if (normalizedQuery.includes("help") || normalizedQuery.includes("what can you do")) {
    return "I can help you with:\n• Finding internships and projects\n• Applying to opportunities\n• Navigating the platform\n• Managing your profile\n• Using the AI teammate matching feature\n• Tracking your career progress\n• Following your learning path\nWhat would you like assistance with?";
  }
  
  // Contextual responses based on keywords
  if (normalizedQuery.includes("internship") || normalizedQuery.includes("job")) {
    return "Looking for internships? You can browse available positions in the Internships section, filter by your skills, and apply directly through the platform. Your applications will be tracked in your workspace.";
  }
  
  if (normalizedQuery.includes("project") || normalizedQuery.includes("team") || normalizedQuery.includes("collaborate")) {
    return "Want to join a project team? Browse available projects in the Projects section. You can filter by required skills, project duration, and other criteria. Use the AI matching feature to find projects that best fit your skill set.";
  }
  
  if (normalizedQuery.includes("profile") || normalizedQuery.includes("portfolio")) {
    return "Your profile showcases your professional identity. It includes your skills dashboard, portfolio of projects, learning path, skill assessment results, and career dashboard. Keep it updated to improve your matches!";
  }
  
  if (normalizedQuery.includes("skill") || normalizedQuery.includes("learning")) {
    return "You can track your skills in the Skills Dashboard and find personalized learning opportunities in your Learning Path. The Skill Assessment feature helps you identify areas for improvement.";
  }
  
  if (normalizedQuery.includes("workspace") || normalizedQuery.includes("dashboard")) {
    return "Your Workspace is your personal dashboard for tracking applications, joined projects, assigned tasks, and career analytics. It's your command center for all platform activities.";
  }
  
  // Default response if no match is found
  return "I'm here to help you make the most of Intern Hub! You can ask me about finding internships, joining projects, tracking applications, managing your profile, or using any of our platform features.";
}

// Updated message sending logic with improved response relevance
export const sendMessage = (message) => async (dispatch) => {
  try {
    // Add user message
    dispatch(addMessage({
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date().toISOString()
    }));
    
    dispatch(setLoading(true));
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a relevant response based on the query
    const relevantResponse = findRelevantResponse(message);
    
    dispatch(addMessage({
      id: (Date.now() + 1).toString(),
      text: relevantResponse,
      sender: 'bot',
      timestamp: new Date().toISOString()
    }));
    
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message || 'Failed to get response'));
  }
};

export default chatbotSlice.reducer; 