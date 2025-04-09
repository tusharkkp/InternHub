const User = require('../models/User');
const Project = require('../models/Project');
const Internship = require('../models/Internship');
const { Configuration, OpenAIApi } = require('openai');

// Initialize OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Skill to job role mapping
const skillToRoleMapping = {
  frontend: ['React.js', 'JavaScript', 'HTML/CSS', 'UI/UX Design'],
  backend: ['Node.js', 'Python', 'Java', 'Database Design'],
  fullstack: ['React.js', 'Node.js', 'MongoDB', 'Express.js'],
  data: ['Python', 'Data Analysis', 'Machine Learning', 'SQL'],
  mobile: ['React Native', 'iOS Development', 'Android Development', 'Mobile UI/UX'],
  devops: ['Docker', 'Kubernetes', 'CI/CD', 'Cloud Platforms'],
};

// Learning resources mapping
const learningResources = {
  'React.js': [
    {
      title: 'React Fundamentals',
      url: 'https://www.udemy.com/course/react-fundamentals/',
      type: 'course',
    },
    {
      title: 'React Documentation',
      url: 'https://reactjs.org/docs/getting-started.html',
      type: 'documentation',
    },
  ],
  'Node.js': [
    {
      title: 'Node.js Complete Guide',
      url: 'https://www.udemy.com/course/nodejs-the-complete-guide/',
      type: 'course',
    },
    {
      title: 'Node.js Best Practices',
      url: 'https://github.com/goldbergyoni/nodebestpractices',
      type: 'documentation',
    },
  ],
  // Add more resources for other skills
};

exports.analyzeUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Analyze user's skills and experience
    const userSkills = user.skills || [];
    const userExperience = user.experience || [];
    const userProjects = await Project.find({ creator: userId });

    // Get AI-powered career recommendations
    const recommendations = await getCareerRecommendations(userSkills, userExperience, userProjects);

    // Get skill gaps and learning path
    const skillGaps = await getSkillGaps(userId, recommendations.recommendedRoles[0].title);
    const learningPath = await generateLearningPath(skillGaps);

    // Get matched internships and projects
    const internshipMatches = await matchInternships(userId);
    const projectMatches = await matchProjects(userId);

    return {
      recommendedRoles: recommendations.recommendedRoles,
      skillGaps,
      learningPath,
      internshipMatches,
      projectMatches,
    };
  } catch (error) {
    console.error('Error analyzing user profile:', error);
    throw error;
  }
};

exports.getSkillGaps = async (userId, targetRole) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const userSkills = user.skills || [];
    const requiredSkills = skillToRoleMapping[targetRole.toLowerCase()] || [];

    // Identify missing skills
    const missingSkills = requiredSkills.filter(
      (skill) => !userSkills.some((userSkill) => userSkill.toLowerCase() === skill.toLowerCase())
    );

    // Generate learning recommendations for each missing skill
    const skillGaps = await Promise.all(
      missingSkills.map(async (skill) => {
        const resources = learningResources[skill] || [];
        return {
          skill,
          description: `Required for ${targetRole} role`,
          learningResource: resources[0]?.url || '#',
        };
      })
    );

    return skillGaps;
  } catch (error) {
    console.error('Error analyzing skill gaps:', error);
    throw error;
  }
};

exports.getLearningResources = async (skill) => {
  try {
    return learningResources[skill] || [];
  } catch (error) {
    console.error('Error getting learning resources:', error);
    throw error;
  }
};

exports.matchInternships = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const userSkills = user.skills || [];
    const internships = await Internship.find({ status: 'active' });

    // Match internships based on skills and requirements
    const matches = internships
      .map((internship) => {
        const requiredSkills = internship.requiredSkills || [];
        const matchScore = calculateMatchScore(userSkills, requiredSkills);

        if (matchScore >= 0.6) {
          return {
            title: internship.title,
            company: internship.company,
            duration: internship.duration,
            location: internship.location,
            applyUrl: internship.applyUrl,
            matchScore,
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    return matches;
  } catch (error) {
    console.error('Error matching internships:', error);
    throw error;
  }
};

exports.matchProjects = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const userSkills = user.skills || [];
    const projects = await Project.find({ status: 'open' });

    // Match projects based on skills and requirements
    const matches = projects
      .map((project) => {
        const requiredSkills = project.requiredSkills || [];
        const matchScore = calculateMatchScore(userSkills, requiredSkills);

        if (matchScore >= 0.6) {
          return {
            title: project.title,
            description: project.description,
            requiredSkills,
            joinUrl: `/projects/${project._id}`,
            matchScore,
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    return matches;
  } catch (error) {
    console.error('Error matching projects:', error);
    throw error;
  }
};

exports.updateCareerPreferences = async (userId, preferences) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.careerPreferences = preferences;
    await user.save();

    return user.careerPreferences;
  } catch (error) {
    console.error('Error updating career preferences:', error);
    throw error;
  }
};

// Helper functions
const getCareerRecommendations = async (userSkills, userExperience, userProjects) => {
  try {
    // Use OpenAI API to analyze user profile and suggest career paths
    const prompt = `Based on the following user profile, suggest suitable career paths:
    Skills: ${userSkills.join(', ')}
    Experience: ${JSON.stringify(userExperience)}
    Projects: ${JSON.stringify(userProjects)}
    
    Please provide career recommendations in the following format:
    {
      "recommendedRoles": [
        {
          "title": "Role Title",
          "description": "Role Description",
          "requiredSkills": ["Skill1", "Skill2", ...]
        }
      ]
    }`;

    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    const recommendations = JSON.parse(completion.data.choices[0].text);
    return recommendations;
  } catch (error) {
    console.error('Error getting career recommendations:', error);
    // Fallback to rule-based recommendations
    return {
      recommendedRoles: [
        {
          title: 'Full Stack Developer',
          description: 'Develop end-to-end web applications with both frontend and backend expertise.',
          requiredSkills: ['React.js', 'Node.js', 'MongoDB', 'Express.js'],
        },
      ],
    };
  }
};

const generateLearningPath = async (skillGaps) => {
  try {
    // Generate a structured learning path based on skill gaps
    const learningPath = skillGaps.map((gap) => ({
      title: `Learn ${gap.skill}`,
      description: `Master ${gap.skill} to improve your career prospects`,
      resources: learningResources[gap.skill] || [],
    }));

    return learningPath;
  } catch (error) {
    console.error('Error generating learning path:', error);
    throw error;
  }
};

const calculateMatchScore = (userSkills, requiredSkills) => {
  if (!userSkills.length || !requiredSkills.length) return 0;

  const matchingSkills = userSkills.filter((skill) =>
    requiredSkills.some((required) => required.toLowerCase() === skill.toLowerCase())
  );

  return matchingSkills.length / requiredSkills.length;
}; 