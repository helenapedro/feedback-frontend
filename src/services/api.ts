import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const uploadResume = async (file: File, format: string, description?: string) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('format', format);
  if (description) formData.append('description', description);

  const response = await axios.post(`${API_URL}/api/resumes/upload`, formData, {
    headers: {
      ...getAuthHeaders(),
    },
  });
  return response.data;
};

export const updateResumeDescription = async (id: string, description: string) => {
  const response = await axios.put(
    `${API_URL}/api/resumes/${id}/update-description`,
    { description },
    { headers: { ...getAuthHeaders() } }
  );
  return response.data;
};


export const fetchResumes = async (page: number = 1, limit: number = 10, format?: string, createdAt?: string) => {
  const response = await axios.get(`${API_URL}/api/resumes`, {
    headers: { ...getAuthHeaders() },
    params: { page, limit, format, createdAt },
  });
  return response.data;
};

export const fetchResumeDetails = async (id: string) => {
  const response = await axios.get(`${API_URL}/api/resumes/${id}`, {
    headers: { ...getAuthHeaders() },
  });
  return response.data;
};

export const deleteResume = async (id: string) => {
  const response = await axios.delete(`${API_URL}/api/resumes/${id}`, {
    headers: { ...getAuthHeaders() },
  });
  return response.data;
};

