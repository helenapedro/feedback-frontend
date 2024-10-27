import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const loginUser = async (email: string, password: string) => {
  return axios.post(`${API_URL}/api/auth/login`, { email, password });
};

export const logoutUser = async () => {
  return axios.post(`${API_URL}/logout`);
};
