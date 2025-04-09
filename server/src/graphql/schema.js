const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    skills: [String!]
    createdAt: String!
    updatedAt: String!
  }

  type Internship {
    id: ID!
    title: String!
    company: String!
    description: String!
    requirements: [String!]
    location: String!
    type: String!
    duration: String!
    stipend: String
    postedBy: User!
    createdAt: String!
    updatedAt: String!
  }

  type Project {
    id: ID!
    title: String!
    description: String!
    requiredSkills: [String!]
    createdBy: User!
    team: [User!]
    status: String!
    createdAt: String!
    updatedAt: String!
  }

  type ForumPost {
    id: ID!
    title: String!
    content: String!
    author: User!
    comments: [Comment!]
    createdAt: String!
    updatedAt: String!
  }

  type Comment {
    id: ID!
    content: String!
    author: User!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    users: [User!]!
    user(id: ID!): User
    internships: [Internship!]!
    internship(id: ID!): Internship
    projects: [Project!]!
    project(id: ID!): Project
    forumPosts: [ForumPost!]!
    forumPost(id: ID!): ForumPost
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    createInternship(
      title: String!
      company: String!
      description: String!
      requirements: [String!]!
      location: String!
      type: String!
      duration: String!
      stipend: String
    ): Internship!
    createProject(
      title: String!
      description: String!
      requiredSkills: [String!]!
    ): Project!
    createForumPost(title: String!, content: String!): ForumPost!
    addComment(postId: ID!, content: String!): Comment!
  }
`;

// Temporary in-memory data store
const users = [];
const internships = [];
const projects = [];
const forumPosts = [];

const resolvers = {
  Query: {
    me: (_, __, { req }) => {
      if (!req.user) return null;
      return req.user;
    },
    users: async () => users,
    user: async (_, { id }) => users.find(user => user.id === id),
    internships: async () => internships,
    internship: async (_, { id }) => internships.find(internship => internship.id === id),
    projects: async () => projects,
    project: async (_, { id }) => projects.find(project => project.id === id),
    forumPosts: async () => forumPosts,
    forumPost: async (_, { id }) => forumPosts.find(post => post.id === id),
  },
  Mutation: {
    register: async (_, { name, email, password }) => {
      const user = {
        id: String(users.length + 1),
        name,
        email,
        skills: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users.push(user);
      return { token: 'dummy-token', user };
    },
    login: async (_, { email, password }) => {
      const user = users.find(u => u.email === email);
      if (!user) throw new Error('User not found');
      return { token: 'dummy-token', user };
    },
    createInternship: async (_, internshipData) => {
      const internship = {
        id: String(internships.length + 1),
        ...internshipData,
        postedBy: users[0], // Temporary: using first user as poster
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      internships.push(internship);
      return internship;
    },
    createProject: async (_, projectData) => {
      const project = {
        id: String(projects.length + 1),
        ...projectData,
        createdBy: users[0], // Temporary: using first user as creator
        team: [],
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      projects.push(project);
      return project;
    },
    createForumPost: async (_, { title, content }) => {
      const post = {
        id: String(forumPosts.length + 1),
        title,
        content,
        author: users[0], // Temporary: using first user as author
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      forumPosts.push(post);
      return post;
    },
    addComment: async (_, { postId, content }) => {
      const post = forumPosts.find(p => p.id === postId);
      if (!post) throw new Error('Post not found');
      
      const comment = {
        id: String(post.comments.length + 1),
        content,
        author: users[0], // Temporary: using first user as author
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      post.comments.push(comment);
      return comment;
    },
  },
};

module.exports = { typeDefs, resolvers }; 