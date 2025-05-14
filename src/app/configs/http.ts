import axios, { AxiosInstance } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const http: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cGVyQHNpZGluaS5jb20iLCJleHAiOjE3NDc0MTM4NzAsImlkIjoxLCJyb2xlIjozfQ.RRXakpLN11CR2GqD80SBp7loVR-wQk-8jdh8hgTmbXE"
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;