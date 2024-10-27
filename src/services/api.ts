import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchResumes = async () => {
  const response = await axios.get(`${API_URL}/api/resumes`, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return response.data.resumes;
};


export const fetchResumeDetails = async (id: string) => {
  return axios.get(`${API_URL}/resumes/${id}`, {
    headers: {
      ...getAuthHeaders(),
    },
  }); 
};

export const uploadResume = async (file: File, format: string) => {
  const formData = new FormData();
  formData.append('resume', file);  
  formData.append('format', format);

  return axios.post(`${API_URL}/resumes/upload`, formData, {
    headers: { 
      'Content-Type': 'multipart/form-data',
      ...getAuthHeaders(), 
    },
  });
};

export const addComment = async (resumeId: string, content: string) => {
  return axios.post(`${API_URL}/comments/add`, { resumeId, content });
};
