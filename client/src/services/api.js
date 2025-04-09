import axios from 'axios';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Internship services
export const internshipService = {
  getInternships: async (filters = {}) => {
    const response = await api.get('/internships', { params: filters });
    return response.data;
  },
  getInternship: async (id) => {
    const response = await api.get(`/internships/${id}`);
    return response.data;
  },
  createInternship: async (internshipData) => {
    const response = await api.post('/internships', internshipData);
    return response.data;
  },
  applyForInternship: async (id, applicationData) => {
    const response = await api.post(`/internships/${id}/apply`, applicationData);
    return response.data;
  },
};

// Project services
export const projectService = {
  getProjects: async (filters = {}) => {
    const response = await api.get('/projects', { params: filters });
    return response.data;
  },
  getProject: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  createProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },
  joinProject: async (id) => {
    const response = await api.post(`/projects/${id}/join`);
    return response.data;
  },
};

// Forum services
export const forumService = {
  getPosts: async (filters = {}) => {
    const response = await api.get('/forum/posts', { params: filters });
    return response.data;
  },
  getPost: async (id) => {
    const response = await api.get(`/forum/posts/${id}`);
    return response.data;
  },
  createPost: async (postData) => {
    const response = await api.post('/forum/posts', postData);
    return response.data;
  },
  addComment: async (postId, commentData) => {
    const response = await api.post(`/forum/posts/${postId}/comments`, commentData);
    return response.data;
  },
};

// Chatbot services
export const chatbotService = {
  sendMessage: async (message, history = [], conversationId = null) => {
    try {
      const response = await api.post('/chatbot/message', {
        message,
        history,
        conversationId,
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      throw error;
    }
  },
};

// Portfolio services
export const portfolioService = {
  createPortfolio: async (portfolioData) => {
    try {
      const response = await api.post('/portfolio/create', portfolioData);
      return response.data;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      throw error;
    }
  },
  getPortfolio: async (userId) => {
    try {
      const response = await api.get(`/portfolio/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      throw error;
    }
  },
  updatePortfolio: async (portfolioId, updateData) => {
    try {
      const response = await api.put(`/portfolio/${portfolioId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating portfolio:', error);
      throw error;
    }
  },
  getShareableLink: async (portfolioId) => {
    try {
      const response = await api.get(`/portfolio/${portfolioId}/share`);
      return response.data;
    } catch (error) {
      console.error('Error getting shareable link:', error);
      throw error;
    }
  },
  getPortfolioTemplates: async () => {
    try {
      const response = await api.get('/portfolio/templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching portfolio templates:', error);
      throw error;
    }
  },
  // For development purposes - mock functions
  mockCreate: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const portfolioId = Math.random().toString(36).substring(2, 15);
        resolve({
          success: true,
          portfolioId,
          url: `https://portfolio.example.com/${portfolioId}`
        });
      }, 1500);
    });
  }
};

export default api; 