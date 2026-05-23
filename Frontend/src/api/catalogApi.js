import axiosInstance from './axios';

const unwrap = (response) => response.data?.data ?? response.data;

export const authorsApi = {
  getAll: async () => unwrap(await axiosInstance.get('/autores')),
  create: async (data) => unwrap(await axiosInstance.post('/autores', data)),
  update: async (id, data) => unwrap(await axiosInstance.put(`/autores/${id}`, data)),
  delete: async (id) => unwrap(await axiosInstance.delete(`/autores/${id}`))
};

export const categoriesApi = {
  getAll: async () => unwrap(await axiosInstance.get('/categorias')),
  create: async (data) => unwrap(await axiosInstance.post('/categorias', data)),
  update: async (id, data) => unwrap(await axiosInstance.put(`/categorias/${id}`, data)),
  delete: async (id) => unwrap(await axiosInstance.delete(`/categorias/${id}`))
};

export const rolesApi = {
  getAll: async () => unwrap(await axiosInstance.get('/roles'))
};
