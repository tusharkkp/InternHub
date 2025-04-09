// Mock user data
export const mockUser = {
  id: '102',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  skills: ['React', 'Redux', 'JavaScript', 'Node.js', 'Express', 'MongoDB']
};

// Mock project team members
export const mockTeamMembers = [
  {
    id: '101',
    name: 'Jane Smith',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    skills: ['UI/UX', 'Frontend', 'React', 'Material UI', 'JavaScript']
  },
  {
    id: '102',
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    skills: ['Backend', 'API', 'Node.js', 'MongoDB', 'Express', 'JavaScript']
  },
  {
    id: '103',
    name: 'Michael Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    skills: ['Frontend', 'Backend', 'Payment Processing', 'API', 'JavaScript', 'Node.js']
  },
  {
    id: '104',
    name: 'Emily Davis',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    skills: ['Python', 'Data Analysis', 'Testing', 'Documentation', 'UI/UX']
  }
];

// Mock projects data
export const mockProjects = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'Building a modern e-commerce platform with React and Node.js',
    teamSize: 5,
    maxTeamSize: 5,
    status: 'Active',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'Express', 'Redux'],
    owner: mockUser,
    members: [mockTeamMembers[0], mockTeamMembers[1]],
    createdAt: '2023-10-15',
    image: 'https://source.unsplash.com/random/300x200/?ecommerce',
    isOwner: true
  },
  {
    id: '2',
    title: 'AI Chatbot',
    description: 'Developing an AI-powered chatbot for customer service',
    teamSize: 3,
    maxTeamSize: 4,
    status: 'Planning',
    requiredSkills: ['Python', 'NLP', 'Machine Learning', 'APIs'],
    owner: mockUser,
    members: [mockTeamMembers[2]],
    createdAt: '2023-11-05',
    image: 'https://source.unsplash.com/random/300x200/?robot',
    isOwner: true
  },
  {
    id: '3',
    title: 'Mobile App Redesign',
    description: 'Redesigning the UI/UX for a fitness tracking mobile app',
    teamSize: 4,
    maxTeamSize: 4,
    status: 'Active',
    requiredSkills: ['UI/UX', 'Mobile Development', 'React Native', 'Figma'],
    owner: {
      id: '105',
      name: 'Alex Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    members: [mockUser, mockTeamMembers[0]],
    createdAt: '2023-09-20',
    image: 'https://source.unsplash.com/random/300x200/?mobile',
    isOwner: false
  }
];

// Mock tasks data
export const mockTasks = [
  {
    id: '1',
    title: 'Design Login Page',
    description: 'Create a modern login page with social login options',
    status: 'In Progress',
    priority: 'High',
    requiredSkills: ['UI/UX', 'Frontend', 'React', 'Material UI'],
    project: {
      id: '1',
      title: 'E-commerce Platform'
    },
    assignedTo: mockTeamMembers[0],
    createdBy: mockUser,
    skillMatchPercentage: 90,
    dueDate: '2023-12-15',
    completed: false,
    createdAt: '2023-11-20'
  },
  {
    id: '2',
    title: 'Implement Payment Gateway',
    description: 'Integrate Stripe payment processing',
    status: 'Not Started',
    priority: 'Medium',
    requiredSkills: ['Backend', 'API', 'Node.js', 'Payment Processing'],
    project: {
      id: '1',
      title: 'E-commerce Platform'
    },
    assignedTo: null,
    createdBy: mockUser,
    skillMatchPercentage: 0,
    dueDate: '2023-12-20',
    completed: false,
    createdAt: '2023-11-21'
  },
  {
    id: '3',
    title: 'Create Product List Component',
    description: 'Build reusable product grid with filtering and sorting',
    status: 'Completed',
    priority: 'Medium',
    requiredSkills: ['Frontend', 'React', 'Material UI', 'JavaScript'],
    project: {
      id: '1',
      title: 'E-commerce Platform'
    },
    assignedTo: mockTeamMembers[0],
    createdBy: mockUser,
    skillMatchPercentage: 95,
    dueDate: '2023-11-30',
    completed: true,
    createdAt: '2023-11-10'
  },
  {
    id: '4',
    title: 'Develop API Endpoints',
    description: 'Create RESTful API endpoints for user management',
    status: 'Not Started',
    priority: 'High',
    requiredSkills: ['Backend', 'API', 'Node.js', 'Express', 'MongoDB'],
    project: {
      id: '1',
      title: 'E-commerce Platform'
    },
    assignedTo: null,
    createdBy: mockUser,
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
      id: '1',
      title: 'E-commerce Platform'
    },
    assignedTo: null,
    createdBy: mockUser,
    skillMatchPercentage: 0,
    dueDate: '2024-01-15',
    completed: false,
    createdAt: '2023-11-25'
  }
];

// Mock internships data
export const mockInternships = [
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
  }
];

export default {
  mockUser,
  mockTeamMembers,
  mockProjects,
  mockTasks,
  mockInternships
}; 