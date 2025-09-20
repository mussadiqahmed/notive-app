import axios from './axiosSingleton';

export const conversationsApi = {
  // Get conversations for a folder
  getConversations: async (folderId = null) => {
    try {
      const params = folderId ? { folderId } : {};
      const response = await axios.get('/conversations', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  },

  // Create a new conversation
  createConversation: async (title, folderId = null) => {
    try {
      const response = await axios.post('/conversations', {
        title,
        folderId
      });
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  },

  // Get messages for a conversation
  getMessages: async (conversationId) => {
    try {
      const response = await axios.get(`/conversations/${conversationId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  // Send a message and get AI response
  sendMessage: async (conversationId, content) => {
    try {
      const response = await axios.post(`/conversations/${conversationId}/messages`, {
        content
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // Update conversation title
  updateConversationTitle: async (conversationId, title) => {
    try {
      const response = await axios.put(`/conversations/${conversationId}/title`, {
        title
      });
      return response.data;
    } catch (error) {
      console.error('Error updating conversation title:', error);
      throw error;
    }
  },

  // Regenerate conversation title using AI
  regenerateConversationTitle: async (conversationId) => {
    try {
      const response = await axios.post(`/conversations/${conversationId}/regenerate-title`);
      return response.data;
    } catch (error) {
      console.error('Error regenerating conversation title:', error);
      throw error;
    }
  },

  // Delete a conversation
  deleteConversation: async (conversationId) => {
    try {
      const response = await axios.delete(`/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }
};

export default conversationsApi;
