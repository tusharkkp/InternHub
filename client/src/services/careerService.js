import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Mock data for development
const mockCareerData = {
  recommendedRoles: [
    {
      title: 'Frontend Developer',
      description: 'Build responsive and interactive web applications using modern frameworks and libraries.',
      requiredSkills: ['React.js', 'JavaScript', 'HTML/CSS', 'UI/UX Design'],
    },
    {
      title: 'Full Stack Developer',
      description: 'Develop end-to-end web applications with both frontend and backend expertise.',
      requiredSkills: ['React.js', 'Node.js', 'MongoDB', 'Express.js'],
    },
  ],
  skillGaps: [
    {
      skill: 'Node.js',
      description: 'Backend development skills needed for full-stack roles',
      learningResource: 'https://www.udemy.com/course/nodejs-the-complete-guide/',
    },
    {
      skill: 'Database Design',
      description: 'Understanding of database architecture and optimization',
      learningResource: 'https://www.coursera.org/learn/database-design',
    },
  ],
  learningPath: [
    {
      title: 'Backend Development',
      description: 'Master server-side programming and database management',
      resources: [
        {
          title: 'Node.js Fundamentals',
          url: 'https://www.udemy.com/course/nodejs-fundamentals/',
        },
        {
          title: 'MongoDB Basics',
          url: 'https://www.mongodb.com/university/courses/M001',
        },
      ],
    },
    {
      title: 'System Design',
      description: 'Learn to design scalable and efficient systems',
      resources: [
        {
          title: 'System Design Primer',
          url: 'https://github.com/donnemartin/system-design-primer',
        },
        {
          title: 'Architecture Patterns',
          url: 'https://www.udemy.com/course/software-architecture-patterns/',
        },
      ],
    },
  ],
  internshipMatches: [
    {
      title: 'Software Development Intern',
      company: 'TechCorp Inc.',
      duration: '3 months',
      location: 'Remote',
      applyUrl: 'https://techcorp.com/careers/internship',
    },
    {
      title: 'Full Stack Developer Intern',
      company: 'StartupX',
      duration: '6 months',
      location: 'Hybrid',
      applyUrl: 'https://startupx.com/careers/internship',
    },
  ],
  projectMatches: [
    {
      title: 'E-commerce Platform',
      description: 'Build a full-stack e-commerce solution with modern tech stack',
      requiredSkills: ['React.js', 'Node.js', 'MongoDB'],
      joinUrl: '/projects/1',
    },
    {
      title: 'AI Chat Application',
      description: 'Develop an AI-powered chat application with real-time features',
      requiredSkills: ['React.js', 'WebSocket', 'Python'],
      joinUrl: '/projects/2',
    },
  ],
};

export const careerService = {
  async getCareerRecommendations(userId) {
    try {
      // In production, replace with actual API call
      const response = await axios.get(`${API_URL}/career/recommendations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching career recommendations:', error);
      // Return mock data for development
      return mockCareerData;
    }
  },

  async analyzeSkillGaps(userId, targetRole) {
    try {
      const response = await axios.post(`${API_URL}/career/skill-gaps`, {
        userId,
        targetRole,
      });
      return response.data;
    } catch (error) {
      console.error('Error analyzing skill gaps:', error);
      throw error;
    }
  },

  async getLearningResources(skill) {
    try {
      const response = await axios.get(`${API_URL}/career/learning-resources`, {
        params: { skill },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching learning resources:', error);
      throw error;
    }
  },

  async getInternshipMatches(userId) {
    try {
      const response = await axios.get(`${API_URL}/career/internship-matches/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching internship matches:', error);
      throw error;
    }
  },

  async getProjectMatches(userId) {
    try {
      const response = await axios.get(`${API_URL}/career/project-matches/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project matches:', error);
      throw error;
    }
  },

  async updateCareerPreferences(userId, preferences) {
    try {
      const response = await axios.put(`${API_URL}/career/preferences/${userId}`, preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating career preferences:', error);
      throw error;
    }
  },
}; 