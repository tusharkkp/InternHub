import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const MatchingContext = createContext();

// Mock user profile
const mockUserProfile = {
  id: "user123",
  name: "Alex Johnson",
  avatar: "https://randomuser.me/api/portraits/people/1.jpg",
  title: "Software Engineering Student",
  bio: "Passionate about web development and AI. Looking for collaborative projects to expand my skills.",
  skills: [
    "React", "JavaScript", "Node.js", "Python", "UI/UX Design", "API Development"
  ],
  personality: {
    type: "ENFJ", // Coach, Teacher
    description: "The Teacher (ENFJ) personality type is charismatic and influential. ENFJs are passionate about helping others grow and develop their potential. They are natural leaders who value connections and enjoy collaborative environments.",
    traits: {
      extraversion: 75,
      openness: 85,
      conscientiousness: 70,
      agreeableness: 80,
      neuroticism: 25
    },
    bigFiveTraits: {
      extraversion: 75,
      openness: 85,
      conscientiousness: 70,
      agreeableness: 80,
      neuroticism: 25
    }
  }
};

// Mock potential teammates with different personality types
const mockTeammates = [
  {
    id: "user234",
    name: "Sarah Chen",
    avatar: "https://randomuser.me/api/portraits/women/23.jpg",
    title: "UX Designer",
    bio: "Passionate about creating intuitive user experiences. I enjoy translating complex ideas into simple, beautiful designs.",
    skills: ["UI/UX Design", "Figma", "User Research", "Prototyping", "Sketch", "HTML/CSS"],
    personality: {
      type: "INFP", // Idealist
      traits: {
        extraversion: 40,
        openness: 90,
        conscientiousness: 65,
        agreeableness: 85,
        neuroticism: 45
      },
      bigFiveTraits: {
        extraversion: 40,
        openness: 90,
        conscientiousness: 65,
        agreeableness: 85,
        neuroticism: 45
      }
    }
  },
  {
    id: "user345",
    name: "Marcus Williams",
    avatar: "https://randomuser.me/api/portraits/men/34.jpg",
    title: "Backend Developer",
    bio: "Software engineer with a passion for scalable systems. I enjoy solving complex problems and learning new technologies.",
    skills: ["Node.js", "Python", "AWS", "MongoDB", "Docker", "System Architecture"],
    personality: {
      type: "INTJ", // Architect
      traits: {
        extraversion: 30,
        openness: 75,
        conscientiousness: 90,
        agreeableness: 55,
        neuroticism: 35
      },
      bigFiveTraits: {
        extraversion: 30,
        openness: 75,
        conscientiousness: 90,
        agreeableness: 55,
        neuroticism: 35
      }
    }
  },
  {
    id: "user456",
    name: "Emily Rodriguez",
    avatar: "https://randomuser.me/api/portraits/women/56.jpg",
    title: "Project Manager",
    bio: "Detail-oriented project manager focused on building efficient team workflows. I help teams stay organized and deliver on time.",
    skills: ["Project Management", "Agile", "Team Leadership", "Communication", "Jira", "Risk Assessment"],
    personality: {
      type: "ESTJ", // Supervisor
      traits: {
        extraversion: 70,
        openness: 60,
        conscientiousness: 95,
        agreeableness: 65,
        neuroticism: 25
      },
      bigFiveTraits: {
        extraversion: 70,
        openness: 60,
        conscientiousness: 95,
        agreeableness: 65,
        neuroticism: 25
      }
    }
  },
  {
    id: "user567",
    name: "David Kim",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    title: "Full-Stack Developer",
    bio: "Creative coder who thrives in dynamic environments. I love building products that solve real user needs.",
    skills: ["React", "Node.js", "TypeScript", "GraphQL", "Redux", "Firebase"],
    personality: {
      type: "ENTP", // Visionary
      traits: {
        extraversion: 80,
        openness: 90,
        conscientiousness: 60,
        agreeableness: 70,
        neuroticism: 40
      },
      bigFiveTraits: {
        extraversion: 80,
        openness: 90,
        conscientiousness: 60,
        agreeableness: 70,
        neuroticism: 40
      }
    }
  },
  {
    id: "user678",
    name: "Olivia Thompson",
    avatar: "https://randomuser.me/api/portraits/women/67.jpg",
    title: "Data Scientist",
    bio: "Data enthusiast with a background in statistics. I enjoy deriving insights from complex datasets and building predictive models.",
    skills: ["Python", "R", "Machine Learning", "Statistical Analysis", "Data Visualization", "SQL"],
    personality: {
      type: "ISTP", // Craftsman
      traits: {
        extraversion: 35,
        openness: 70,
        conscientiousness: 75,
        agreeableness: 60,
        neuroticism: 30
      },
      bigFiveTraits: {
        extraversion: 35,
        openness: 70,
        conscientiousness: 75,
        agreeableness: 60,
        neuroticism: 30
      }
    }
  },
  {
    id: "user789",
    name: "Noah Garcia",
    avatar: "https://randomuser.me/api/portraits/men/78.jpg",
    title: "DevOps Engineer",
    bio: "System reliability enthusiast. I focus on building efficient infrastructures and automated deployment pipelines.",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Linux"],
    personality: {
      type: "ISTJ", // Inspector
      traits: {
        extraversion: 25,
        openness: 55,
        conscientiousness: 95,
        agreeableness: 60,
        neuroticism: 30
      },
      bigFiveTraits: {
        extraversion: 25,
        openness: 55,
        conscientiousness: 95,
        agreeableness: 60,
        neuroticism: 30
      }
    }
  },
  {
    id: "user890",
    name: "Ava Wilson",
    avatar: "https://randomuser.me/api/portraits/women/89.jpg",
    title: "Content Strategist",
    bio: "Creative professional specializing in content strategy and copywriting. I help teams communicate effectively with their audience.",
    skills: ["Content Strategy", "Copywriting", "SEO", "Social Media", "Brand Messaging", "Content Planning"],
    personality: {
      type: "ENFP", // Champion
      traits: {
        extraversion: 85,
        openness: 95,
        conscientiousness: 60,
        agreeableness: 80,
        neuroticism: 45
      },
      bigFiveTraits: {
        extraversion: 85,
        openness: 95,
        conscientiousness: 60,
        agreeableness: 80,
        neuroticism: 45
      }
    }
  }
];

// Mock internship and project opportunities
const mockOpportunities = [
  {
    id: "opp123",
    title: "Frontend Development Internship",
    company: "TechStart Inc.",
    companyLogo: "https://placehold.co/100",
    location: "Remote",
    type: "Internship",
    duration: "3 months",
    description: "Join our team to build responsive user interfaces using React and modern frontend tools. Work closely with designers and backend engineers to implement feature-rich web applications.",
    requiredSkills: ["React", "JavaScript", "HTML/CSS", "Git", "UI/UX Principles"]
  },
  {
    id: "opp234",
    title: "Full-Stack Developer - Student Project",
    company: "Campus Innovators",
    companyLogo: "https://placehold.co/100",
    location: "On-campus",
    type: "Student Project",
    duration: "1 semester",
    description: "Collaborate with a team of students to build a campus resource sharing platform. You'll be working on both frontend and backend components using the MERN stack.",
    requiredSkills: ["React", "Node.js", "MongoDB", "Express", "JavaScript", "Team Collaboration"]
  },
  {
    id: "opp345",
    title: "UI/UX Design Internship",
    company: "Creative Design Co.",
    companyLogo: "https://placehold.co/100",
    location: "Hybrid",
    type: "Internship",
    duration: "6 months",
    description: "Work with our design team to create user-centered designs for web and mobile applications. You'll be involved in the entire design process from research to prototyping.",
    requiredSkills: ["UI/UX Design", "Figma", "User Research", "Wireframing", "Prototyping"]
  },
  {
    id: "opp456",
    title: "Backend Engineering Challenge",
    company: "DataFlow Systems",
    companyLogo: "https://placehold.co/100",
    location: "Remote",
    type: "Project",
    duration: "2 months",
    description: "Design and implement a scalable API for a high-traffic application. Focus on performance optimization, security, and code quality.",
    requiredSkills: ["Node.js", "API Design", "Database Design", "Authentication", "Performance Optimization"]
  },
  {
    id: "opp567",
    title: "Machine Learning Research Assistant",
    company: "University Research Lab",
    companyLogo: "https://placehold.co/100",
    location: "On-campus",
    type: "Research",
    duration: "Academic Year",
    description: "Assist faculty researchers in developing and implementing machine learning models for natural language processing tasks. Includes data preparation, model training, and evaluation.",
    requiredSkills: ["Python", "Machine Learning", "NLP", "Data Analysis", "Research Methods"]
  },
  {
    id: "opp678",
    title: "DevOps Intern",
    company: "CloudSphere Technologies",
    companyLogo: "https://placehold.co/100",
    location: "Hybrid",
    type: "Internship",
    duration: "4 months",
    description: "Join our DevOps team to improve CI/CD pipelines and infrastructure automation. You'll work with modern cloud technologies and containerization tools.",
    requiredSkills: ["AWS/Cloud Services", "Docker", "CI/CD", "Linux", "Scripting"]
  },
  {
    id: "opp789",
    title: "Mobile App Development Team",
    company: "Student Entrepreneurs Club",
    companyLogo: "https://placehold.co/100",
    location: "On-campus",
    type: "Student Project",
    duration: "1 semester",
    description: "Collaborate with a cross-functional team to develop a mobile app for campus navigation and event discovery. Positions available for iOS, Android, and backend developers.",
    requiredSkills: ["Mobile Development", "UI Design", "API Integration", "Team Collaboration", "Git"]
  }
];

// Provider component
export const MatchingProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(mockUserProfile);
  const [teammates, setTeammates] = useState(mockTeammates);
  const [opportunities, setOpportunities] = useState(mockOpportunities);
  const [loading, setLoading] = useState(true);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Update user personality from test results
  const updateUserPersonality = (personalityData) => {
    setUserProfile(prev => ({
      ...prev,
      personality: {
        ...prev.personality,
        ...personalityData
      }
    }));
  };

  // Value to be provided
  const value = {
    userProfile,
    teammates,
    opportunities,
    loading,
    updateUserPersonality
  };

  return (
    <MatchingContext.Provider value={value}>
      {children}
    </MatchingContext.Provider>
  );
};

// Custom hook to use the matching context
export const useMatching = () => {
  const context = useContext(MatchingContext);
  if (context === undefined) {
    throw new Error('useMatching must be used within a MatchingProvider');
  }
  return context;
};

export default MatchingProvider; 