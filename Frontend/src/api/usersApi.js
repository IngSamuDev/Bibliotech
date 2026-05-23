import axiosInstance from './axios';

export const usersApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/usuarios');
    return response.data?.data ?? response.data;
  },

  create: async (userData) => {
    const response = await axiosInstance.post('/usuarios', userData);
    return response.data?.data ?? response.data;
  },

  update: async (id, userData) => {
    const response = await axiosInstance.put(`/usuarios/${id}`, userData);
    return response.data?.data ?? response.data;
  },

  setStatus: async (id, estado_usuarios) => {
    const response = await axiosInstance.patch(`/usuarios/${id}`, { estado_usuarios });
    return response.data?.data ?? response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/usuarios/${id}`);
    return response.data?.data ?? response.data;
  }
};
