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

export const fetchAllUsers = async () => {
  return api.get('/api/admin/users');
};

export const fetchSingleUser = async (userId: string) => {
  return api.get(`/api/admin/user/${userId}`);
};

export const deactivateUser = async (userId: string) => {
  return api.delete(`/api/admin/user/${userId}/deactivate`);
};
