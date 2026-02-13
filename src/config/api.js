// API Configuration for different environments
const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : `${window.location.origin}/api`
);

export const API_ENDPOINTS = {
  DATA: `${API_BASE_URL}/data`,
  MESSAGES: `${API_BASE_URL}/messages`,
  MESSAGES_STATS: `${API_BASE_URL}/messages/stats`,
  CHATBOT_ALL: `${API_BASE_URL}/chatbot/all`,
  CHATBOT_SAVE: `${API_BASE_URL}/chatbot/save`,
  USERS: `${API_BASE_URL}/users`,
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_VERIFY: `${API_BASE_URL}/auth/verify`,
  QA: `${API_BASE_URL}/qa`,
};

export default API_BASE_URL;

