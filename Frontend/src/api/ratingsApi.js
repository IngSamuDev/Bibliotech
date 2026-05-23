import axiosInstance from './axios';

export const ratingsApi = {
  create: async (id_libros, puntuacion, comentario) => {
    const response = await axiosInstance.post('/calificaciones', {
      id_libros,
      puntuacion,
      comentario
    });
    return response.data;
  },

  getByBook: async (id_libros) => {
    const response = await axiosInstance.get(`/calificaciones/libro/${id_libros}`);
    return response.data;
  },

  getUserRating: async (id_libros) => {
    const response = await axiosInstance.get(`/calificaciones/usuario/libro/${id_libros}`);
    return response.data;
  },

  getAll: async () => {
    const response = await axiosInstance.get('/calificaciones');
    return response.data;
  },

  delete: async (id_calificaciones) => {
    const response = await axiosInstance.delete(`/calificaciones/${id_calificaciones}`);
    return response.data;
  }
};
