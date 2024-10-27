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

export const fetchUserDetails = async (userId: string) => {
     return api.get(`/api/users/${userId}`);
   };
   
export const updateUserDetails = async (userId: string, data: { username?: string; email?: string }) => {
return api.put(`/api/users/${userId}`, data);
};

export const updateUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
return api.put(`/api/users/${userId}/password`, { currentPassword, newPassword });
};

export const deleteUserAccount = async (userId: string) => {
return api.delete(`/api/users/${userId}`);
};