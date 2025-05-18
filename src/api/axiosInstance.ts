import axios,  { type AxiosInstance, type AxiosRequestConfig } from "axios";

// Environment variables (recommended for sensitive data)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_USERNAME = import.meta.env.VITE_API_USERNAME;
const API_PASSWORD = import.meta.env.VITE_API_PASSWORD;
console.log({
  BASE: import.meta.env.VITE_API_BASE_URL,
  USER: import.meta.env.VITE_API_USERNAME,
  PASS: import.meta.env.VITE_API_PASSWORD?.replace(/./g, '*'),
});

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Basic Auth interceptor
axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
  if (API_USERNAME && API_PASSWORD) {
    const credentials = btoa(`${API_USERNAME}:${API_PASSWORD}`);
    config.headers = {
      ...config.headers,
      Authorization: `Basic ${credentials}`,
    };
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
