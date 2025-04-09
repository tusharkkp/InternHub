require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./graphql/schema');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GraphQL setup
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
  playground: process.env.NODE_ENV === 'development',
});

// Start Apollo Server
const startServer = async () => {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
};

startServer();

// Import chatbot routes
const chatbotRoutes = require('./routes/chatbot');
const careerRoutes = require('./routes/career');

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/internships', require('./routes/internships'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/forum', require('./routes/forum'));
app.use('/api/chatbot', chatbotRoutes); // Add chatbot routes
app.use('/api/career', careerRoutes);
app.use('/api/tasks', require('./routes/tasks')); // Add tasks routes

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Internship & Project Collaboration Hub API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL endpoint: http://localhost:${PORT}${apolloServer.graphqlPath}`);
}); 