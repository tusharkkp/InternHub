import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import internshipReducer from './slices/internshipSlice';
import discussionsReducer from './slices/discussionsSlice';
import chatbotReducer from './slices/chatbotSlice';
import personalityReducer from './slices/personalitySlice';
import workspaceReducer from './slices/workspaceSlice';
import taskReducer from './slices/taskSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    internships: internshipReducer,
    discussions: discussionsReducer,
    chatbot: chatbotReducer,
    personality: personalityReducer,
    workspace: workspaceReducer,
    tasks: taskReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['discussions.messages'],
      },
    }),
});

export default store; 