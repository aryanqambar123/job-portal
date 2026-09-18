import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getJobs = async (params) => {
  const response = await api.get('/jobs', { params });
  return response.data;
};

export const getJobById = async (id) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

export const getCountries = async () => {
  const response = await api.get('/jobs/countries');
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/jobs/categories');
  return response.data;
};

export const getCompanies = async () => {
  const response = await api.get('/jobs/companies');
  return response.data;
};

export default api;