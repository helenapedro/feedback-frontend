import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const TOKEN_KEY = 'authToken'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = async (username: string, email: string, password: string) => {
  return api.post('/api/auth/register', { username, email, password });
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    
    const { token } = response.data;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
    return response;

  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      throw new Error('Invalid credentials');
    } else {
      throw error; 
    }
  }
};

export const logoutUser = () => {
  localStorage.removeItem(TOKEN_KEY);
};