import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const fetchPosts = async (before = null, limit = 10) => {
  const params = { limit };
  if (before) params.before = before;

  const response = await api.get('/posts', { params });

  return response.data;
};

export const createPost = async (content) => {
  const response = await api.post('/posts', { content });

  return response.data;
};

export default api;