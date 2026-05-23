import axiosInstance from './axios';

export const authApi = {
  login: async (email, password) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (nombre, email, password) => {
    const response = await axiosInstance.post('/auth/registro', { nombre, email, password });
    return response.data;
  }
};
