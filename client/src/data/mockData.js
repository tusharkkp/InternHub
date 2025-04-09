import React from 'react';
import {
  Code as CodeIcon,
  Psychology as PsychologyIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Devices as DevicesIcon,
  Business as BusinessIcon,
  School as SchoolIcon,
  People as PeopleIcon
} from '@mui/icons-material';

// Discussion Topics Data
export const discussionTopics = [
  {
    id: '1',
    title: 'React Discussion',
    description: 'Share React tips, ask questions, and discuss best practices in React development.',
    icon: <CodeIcon fontSize="large" color="primary" />,
    color: 'primary',
    memberCount: 243,
    messageCount: 1245,
  },
  {
    id: '2',
    title: 'AI & ML',
    description: 'Discuss artificial intelligence, machine learning concepts, tools, and applications.',
    icon: <PsychologyIcon fontSize="large" color="secondary" />,
    color: 'secondary',
    memberCount: 187,
    messageCount: 934,
  },
  {
    id: '3',
    title: 'Internship Experiences',
    description: 'Share your internship experiences, ask about companies, and get advice from peers.',
    icon: <WorkIcon fontSize="large" color="success" />,
    color: 'success',
    memberCount: 362,
    messageCount: 1678,
  },
  {
    id: '4',
    title: 'Project Ideas',
    description: 'Explore project ideas, find collaborators, and share your portfolio projects.',
    icon: <StarIcon fontSize="large" color="info" />,
    color: 'info',
    memberCount: 289,
    messageCount: 1190,
  },
  {
    id: '5',
    title: 'Web Development',
    description: 'Discuss web development technologies, frameworks, and debugging solutions.',
    icon: <DevicesIcon fontSize="large" color="error" />,
    color: 'error',
    memberCount: 412,
    messageCount: 2056,
  },
  {
    id: '6',
    title: 'Freelancing & Career Guidance',
    description: 'Get advice on freelancing, career development, and job hunting in the tech industry.',
    icon: <BusinessIcon fontSize="large" color="warning" />,
    color: 'warning',
    memberCount: 201,
    messageCount: 872,
  },
  {
    id: '7',
    title: 'Student Resources',
    description: 'Share educational resources, study materials, and strategies for tech students.',
    icon: <SchoolIcon fontSize="large" />,
    color: 'info',
    memberCount: 158,
    messageCount: 623,
  },
  {
    id: '8',
    title: 'Community Events',
    description: 'Discuss upcoming tech events, hackathons, and networking opportunities.',
    icon: <PeopleIcon fontSize="large" color="primary" />,
    color: 'primary',
    memberCount: 134,
    messageCount: 450,
  },
];

// Mock data for chat messages
export const generateMockMessages = (topicId) => {
  const users = [
    { id: '1', name: 'Alex Chen', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: '2', name: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: '3', name: 'Miguel Rodriguez', avatar: 'https://randomuser.me/api/portraits/men/56.jpg' },
    { id: '4', name: 'Priya Patel', avatar: 'https://randomuser.me/api/portraits/women/63.jpg' },
    { id: 'current', name: 'You', avatar: 'https://randomuser.me/api/portraits/lego/1.jpg' }
  ];

  const topics = {
    '1': [
      { id: '1', sender: users[0], content: 'Has anyone tried the new React 18 features?', timestamp: new Date(Date.now() - 86400000 * 2) },
      { id: '2', sender: users[1], content: 'Yes! The new concurrent rendering is amazing for performance.', timestamp: new Date(Date.now() - 86400000 * 2 + 3600000) },
      { id: '3', sender: users[2], content: "I'm still trying to wrap my head around useTransition and useDeferredValue hooks.", timestamp: new Date(Date.now() - 86400000) },
      { id: '4', sender: users[0], content: 'useTransition is great for marking UI updates as non-urgent. It helps prioritize important updates.', timestamp: new Date(Date.now() - 43200000) }
    ],
    '2': [
      { id: '1', sender: users[1], content: 'What ML frameworks are you all using these days?', timestamp: new Date(Date.now() - 86400000 * 3) },
      { id: '2', sender: users[3], content: 'TensorFlow is still my go-to for most projects.', timestamp: new Date(Date.now() - 86400000 * 3 + 7200000) },
      { id: '3', sender: users[2], content: 'PyTorch has been gaining a lot of traction lately, especially in research.', timestamp: new Date(Date.now() - 86400000 * 2) },
      { id: '4', sender: users[0], content: 'Has anyone played with Hugging Face transformers? They make NLP so accessible.', timestamp: new Date(Date.now() - 21600000) }
    ],
    '3': [
      { id: '1', sender: users[3], content: 'Just finished my internship at Google. It was an incredible experience!', timestamp: new Date(Date.now() - 86400000 * 5) },
      { id: '2', sender: users[2], content: "That's awesome! What team were you on?", timestamp: new Date(Date.now() - 86400000 * 5 + 5400000) },
      { id: '3', sender: users[3], content: 'I was on the Google Maps team working on their recommendation algorithm.', timestamp: new Date(Date.now() - 86400000 * 5 + 9000000) },
      { id: '4', sender: users[1], content: "I'm applying for Microsoft's internship program. Any tips?", timestamp: new Date(Date.now() - 18000000) }
    ],
    '4': [
      { id: '1', sender: users[0], content: "I'm looking for project ideas that combine web dev and ML. Any suggestions?", timestamp: new Date(Date.now() - 86400000 * 4) },
      { id: '2', sender: users[2], content: 'How about a personal finance app that predicts future expenses based on your spending patterns?', timestamp: new Date(Date.now() - 86400000 * 4 + 4800000) },
      { id: '3', sender: users[1], content: 'Or a recipe recommendation system based on what ingredients you have at home.', timestamp: new Date(Date.now() - 86400000 * 2) },
      { id: '4', sender: users[3], content: "I've been working on a project that uses NLP to summarize academic papers for students.", timestamp: new Date(Date.now() - 10800000) }
    ],
    '5': [
      { id: '1', sender: users[1], content: "What's your favorite CSS framework?", timestamp: new Date(Date.now() - 86400000 * 3) },
      { id: '2', sender: users[0], content: 'Tailwind CSS has been a game-changer for my workflow.', timestamp: new Date(Date.now() - 86400000 * 3 + 3600000) },
      { id: '3', sender: users[3], content: 'I still prefer Bootstrap for quick prototyping, but Tailwind is growing on me.', timestamp: new Date(Date.now() - 86400000) },
      { id: '4', sender: users[2], content: "Has anyone tried Chakra UI with React? It's amazing for accessible components.", timestamp: new Date(Date.now() - 7200000) }
    ],
    '6': [
      { id: '1', sender: users[2], content: 'How do you determine your freelance rates as a junior developer?', timestamp: new Date(Date.now() - 86400000 * 6) },
      { id: '2', sender: users[0], content: 'I started with slightly below market rates to build my portfolio, then gradually increased as I gained experience.', timestamp: new Date(Date.now() - 86400000 * 6 + 7200000) },
      { id: '3', sender: users[3], content: "Don't undervalue yourself! Research what others charge in your area for similar skills.", timestamp: new Date(Date.now() - 86400000 * 4) },
      { id: '4', sender: users[1], content: 'I found that doing a few fixed-price projects helped me gauge how long things take, which helped me set better hourly rates later.', timestamp: new Date(Date.now() - 14400000) }
    ],
    '7': [
      { id: '1', sender: users[3], content: 'What are some good resources for learning data structures and algorithms?', timestamp: new Date(Date.now() - 86400000 * 7) },
      { id: '2', sender: users[1], content: 'I highly recommend the Algorithms course by Princeton on Coursera.', timestamp: new Date(Date.now() - 86400000 * 7 + 5400000) },
      { id: '3', sender: users[0], content: 'LeetCode and HackerRank are great for practice, but make sure you understand the fundamentals first.', timestamp: new Date(Date.now() - 86400000 * 3) },
      { id: '4', sender: users[2], content: 'I found Grokking Algorithms to be a really accessible book for beginners.', timestamp: new Date(Date.now() - 28800000) }
    ],
    '8': [
      { id: '1', sender: users[0], content: 'Anyone going to the HackTech conference next month?', timestamp: new Date(Date.now() - 86400000 * 10) },
      { id: '2', sender: users[3], content: "I'll be there! Looking forward to the AI workshops.", timestamp: new Date(Date.now() - 86400000 * 10 + 10800000) },
      { id: '3', sender: users[2], content: "I'm participating in the Microsoft hackathon this weekend. Anyone else joining?", timestamp: new Date(Date.now() - 86400000 * 2) },
      { id: '4', sender: users[1], content: "There's a great tech meetup happening downtown this Thursday if anyone wants to network.", timestamp: new Date(Date.now() - 36000000) }
    ]
  };

  return topics[topicId] || [];
}; 