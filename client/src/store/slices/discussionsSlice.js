import { createSlice } from '@reduxjs/toolkit';

// Initial state for the discussions feature
const initialState = {
  topics: [],
  selectedTopic: null,
  messages: {},
  loading: false,
  error: null
};

const discussionsSlice = createSlice({
  name: 'discussions',
  initialState,
  reducers: {
    // Set the list of available topics
    setTopics: (state, action) => {
      state.topics = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Set the currently selected topic
    setSelectedTopic: (state, action) => {
      state.selectedTopic = action.payload;
    },

    // Clear the selected topic
    clearSelectedTopic: (state) => {
      state.selectedTopic = null;
    },

    // Set messages for a specific topic
    setMessages: (state, action) => {
      const { topicId, messages } = action.payload;
      state.messages[topicId] = messages;
      state.loading = false;
      state.error = null;
    },

    // Add a new message to a topic
    addMessage: (state, action) => {
      const { topicId, message } = action.payload;
      
      if (!state.messages[topicId]) {
        state.messages[topicId] = [];
      }
      
      state.messages[topicId].push(message);
    },

    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

// Export actions
export const {
  setTopics,
  setSelectedTopic,
  clearSelectedTopic,
  setMessages,
  addMessage,
  setLoading,
  setError
} = discussionsSlice.actions;

// Thunk action to fetch topics
export const fetchTopics = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    // In a real app, you would make an API call here
    // For now, we'll simulate a delay
    setTimeout(() => {
      // This would be the response from your API
      const topics = [
        { 
          id: 'react', 
          title: 'React Discussion', 
          description: 'Share tips, ask questions and discuss React development',
          messageCount: 156
        },
        { 
          id: 'ai', 
          title: 'AI & ML', 
          description: 'Artificial Intelligence and Machine Learning topics',
          messageCount: 132
        },
        // Add more topics as needed
      ];
      
      dispatch(setTopics(topics));
    }, 1000);
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// Thunk action to fetch messages for a topic
export const fetchMessages = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    // In a real app, you would make an API call here
    // For now, we'll simulate a delay
    setTimeout(() => {
      // This would be the response from your API
      const messages = [
        // Sample messages would be fetched from API
      ];
      
      dispatch(setMessages({ topicId, messages }));
    }, 1000);
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// Thunk action to send a message
export const sendMessage = (topicId, messageContent) => async (dispatch, getState) => {
  try {
    const { auth } = getState();
    
    // Create a new message object
    const message = {
      id: Date.now().toString(),
      user: {
        id: auth.user?.id || 'currentUser',
        name: auth.user?.name || 'You',
        avatar: auth.user?.avatar || '/avatars/default.jpg'
      },
      content: messageContent,
      timestamp: new Date().toISOString()
    };
    
    // In a real app, you would make an API call here
    // For now, we'll just dispatch the action directly
    dispatch(addMessage({ topicId, message }));
    
    return true;
  } catch (error) {
    dispatch(setError(error.message));
    return false;
  }
};

export default discussionsSlice.reducer; 