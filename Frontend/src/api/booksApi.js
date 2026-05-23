import axiosInstance from './axios';

export const booksApi = {
  getAll: async () => {
    const response = await axiosInstance.get('/libros');
    return response.data?.data ?? response.data;
  },

  getAllAdmin: async () => {
    const response = await axiosInstance.get('/libros/admin/todos');
    return response.data?.data ?? response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`/libros/${id}`);
    return response.data?.data ?? response.data;
  },

  create: async (bookData) => {
    const response = await axiosInstance.post('/libros', bookData, {
      headers: bookData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined
    });
    return response.data?.data ?? response.data;
  },

  update: async (id, bookData) => {
    const response = await axiosInstance.put(`/libros/${id}`, bookData, {
      headers: bookData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined
    });
    return response.data?.data ?? response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`/libros/${id}`);
    return response.data?.data ?? response.data;
  },

  setStatus: async (id, activo_libros) => {
    const response = await axiosInstance.patch(`/libros/${id}`, { activo_libros });
    return response.data?.data ?? response.data;
  },

  getRating: async (id_libros) => {
    const response = await axiosInstance.get(`/calificaciones/${id_libros}`);
    return response.data?.data ?? response.data;
  },

  rate: async (id_libros, puntuacion) => {
    const response = await axiosInstance.post(`/calificaciones/${id_libros}`, { puntuacion });
    return response.data?.data ?? response.data;
  },

  registerDownload: async (id_libros) => {
    const response = await axiosInstance.post('/descargas', { id_libros });
    return response.data?.data ?? response.data;
  },

  registerView: async (id_libros) => {
    const response = await axiosInstance.post('/visualizaciones', { id_libros });
    return response.data?.data ?? response.data;
  }
};
