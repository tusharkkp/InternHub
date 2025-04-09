const express = require('express');
const router = express.Router();
const axios = require('axios');
const { body, validationResult } = require('express-validator');

// Load environment variables
require('dotenv').config();

// Middleware for authentication
const auth = require('../middleware/auth');

// Create a new chatbot conversation or continue an existing one
router.post(
  '/message',
  [
    auth, // Require authentication
    body('message').notEmpty().withMessage('Message is required'),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { message, conversationId } = req.body;
      const userId = req.user.id;

      // Get user profile information for context
      // This would typically come from your database
      // For this example, we'll use a mock user profile
      const userProfile = {
        name: req.user.name,
        skills: ['JavaScript', 'React', 'Node.js'], // This would usually come from the user's profile
        interests: ['Web Development', 'Machine Learning'],
        education: 'Computer Science',
      };

      // You would typically store conversation history in your database
      // For this example, we'll assume the client sends the relevant history
      const conversationHistory = req.body.history || [];

      // Prepare the prompt for OpenAI
      // This combines user profile, conversation history, and the current message
      const prompt = generatePrompt(message, conversationHistory, userProfile);

      // Call OpenAI API
      const openaiResponse = await callOpenAI(prompt);

      // Process the response
      const processedResponse = processResponse(openaiResponse, userProfile);

      // Store the conversation in your database (not implemented here)
      // storeConversation(userId, conversationId, message, processedResponse);

      // Return the response to the client
      return res.json({
        success: true,
        response: processedResponse,
        conversationId: conversationId || Date.now().toString(), // Generate a new ID if none provided
      });
    } catch (error) {
      console.error('Error in chatbot processing:', error);
      return res.status(500).json({
        success: false,
        message: 'Error processing your request',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  }
);

// Function to generate a prompt for OpenAI
function generatePrompt(message, history, userProfile) {
  // Create a system message that describes the chatbot's role and includes user profile
  const systemMessage = `You are SkillSync AI, an assistant for a student internship and project collaboration platform. 
You help users find internships, projects, and teammates based on their skills and interests.

User profile:
- Name: ${userProfile.name || 'Anonymous'}
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Interests: ${userProfile.interests?.join(', ') || 'Not specified'}
- Education: ${userProfile.education || 'Not specified'}

When suggesting internships, projects, or teammates, try to match them with the user's skills and interests.
Keep responses concise, helpful, and friendly. If you don't know something, be honest about it.`;

  // Format conversation history
  const formattedHistory = history.map((entry) => ({
    role: entry.sender === 'user' ? 'user' : 'assistant',
    content: entry.text,
  }));

  // Create the full prompt with system message, history, and current message
  return {
    messages: [
      { role: 'system', content: systemMessage },
      ...formattedHistory,
      { role: 'user', content: message },
    ],
  };
}

// Function to call OpenAI API
async function callOpenAI(prompt) {
  try {
    // This is where you would make a real API call to OpenAI
    // Replace API_KEY with your actual OpenAI API key
    /*
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4', // or 'gpt-3.5-turbo' for a more cost-effective option
        messages: prompt.messages,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );
    return response.data.choices[0].message.content;
    */

    // For development purposes, return a mock response
    return simulateOpenAIResponse(prompt);
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
}

// Function to process the OpenAI response
function processResponse(openaiResponse, userProfile) {
  // This function could enhance the response with additional data
  // For example, adding links to actual internships or projects in your system
  // For now, we'll just return the raw response
  return openaiResponse;
}

// Mock function to simulate OpenAI responses for development
function simulateOpenAIResponse(prompt) {
  const userMessage = prompt.messages[prompt.messages.length - 1].content.toLowerCase();
  
  if (userMessage.includes('internship') || userMessage.includes('job')) {
    return `Based on your skills, here are some internship opportunities that might interest you:

1. Frontend Developer at TechCorp (90% match)
   - React, JavaScript, HTML/CSS
   - 3-month remote position
   - Application deadline: June 15, 2023

2. Web Developer at InnovateTech (85% match)
   - JavaScript, Node.js, Express
   - 6-month hybrid position
   - Application deadline: May 30, 2023

3. Full Stack Developer at WebSolutions (82% match)
   - React, Node.js, MongoDB
   - 4-month on-site position
   - Application deadline: June 5, 2023

Would you like me to help you prepare application materials for any of these positions?`;
  }
  
  if (userMessage.includes('project') || userMessage.includes('collaborate')) {
    return `Here are some projects that match your skills:

1. E-commerce Platform (3 open roles)
   - Looking for: Frontend Developer, Backend Developer, UI/UX Designer
   - Tech stack: React, Node.js, MongoDB
   - Duration: 3 months

2. Social Media Dashboard (2 open roles)
   - Looking for: Frontend Developer, Data Visualization Specialist
   - Tech stack: React, D3.js, Firebase
   - Duration: 2 months

3. Mobile Chat Application (4 open roles)
   - Looking for: React Native Developer, Backend Developer, UI Designer, QA Tester
   - Tech stack: React Native, Firebase, Node.js
   - Duration: 4 months

Would you like more information about any of these projects, or would you like to connect with the project creators?`;
  }
  
  if (userMessage.includes('teammate') || userMessage.includes('team member')) {
    return `Based on the skills needed for your project, here are potential teammates:

1. Sarah Chen (Frontend Developer)
   - Skills: React, JavaScript, CSS, Figma
   - 92% compatibility with your project
   - 8 completed projects on SkillSync
   
2. Michael Johnson (Backend Developer)
   - Skills: Node.js, Express, MongoDB, GraphQL
   - 88% compatibility with your project
   - 12 completed projects on SkillSync
   
3. Aisha Patel (Full Stack Developer)
   - Skills: React, Node.js, PostgreSQL, Docker
   - 85% compatibility with your project
   - 6 completed projects on SkillSync

Would you like me to facilitate an introduction to any of these developers?`;
  }
  
  if (userMessage.includes('cover letter') || userMessage.includes('application')) {
    return `Here's a draft cover letter you can customize for your internship application:

Dear Hiring Manager,

I am writing to express my interest in the [Position] internship at [Company]. As a student with a strong background in JavaScript, React, and Node.js, I am excited about the opportunity to contribute to [Company's] innovative projects.

Through my coursework and personal projects, I have developed skills in building responsive web applications, implementing RESTful APIs, and working with databases. I am particularly impressed by [Company's] work on [Product/Project] and would welcome the chance to learn from your experienced team while contributing my technical skills and fresh perspective.

I have attached my resume for your review. I would appreciate the opportunity to discuss how my skills and enthusiasm align with your team's needs.

Thank you for considering my application.

Sincerely,
[Your Name]

Would you like me to help you tailor this letter for a specific position?`;
  }
  
  if (userMessage.includes('help') || userMessage.includes('what can you do')) {
    return `I can help you with several things on the SkillSync platform:

1. Find internships based on your skills and interests
2. Discover projects that need collaborators with your expertise
3. Suggest potential teammates for your projects
4. Help draft cover letters and application materials
5. Provide career advice and skill development suggestions
6. Navigate the platform and explain features

What would you like assistance with today?`;
  }
  
  // Default response
  return `I'm here to help you navigate the SkillSync platform, find opportunities, and connect with others. 

Some things I can assist you with:
- Finding internships that match your skills
- Discovering projects for collaboration
- Connecting with potential teammates
- Drafting application materials
- Answering questions about the platform

What would you like help with today?`;
}

module.exports = router; 