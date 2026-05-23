const calificacionModel = require('../models/calificacionModel');

const crear = async (req, res) => {
    try {
        const { id_libros, puntuacion, comentario } = req.body;
        const id_usuarios = req.usuario.id_usuario;

        if (!id_libros || !puntuacion) {
            return res.status(400).json({ message: 'El libro y la puntuación son obligatorios' });
        }

        if (puntuacion < 1 || puntuacion > 5) {
            return res.status(400).json({ message: 'La puntuación debe estar entre 1 y 5' });
        }

        const calificacion = await calificacionModel.crear(id_usuarios, id_libros, puntuacion, comentario || null);
        res.status(201).json({ message: 'Calificación guardada', data: calificacion });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerPorLibro = async (req, res) => {
    try {
        const { id } = req.params;
        const calificaciones = await calificacionModel.obtenerPorLibro(id);
        const promedio = await calificacionModel.obtenerPromedioLibro(id);
        
        res.json({
            calificaciones,
            promedio: parseFloat(promedio.promedio).toFixed(1),
            total: parseInt(promedio.total_calificaciones)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerCalificacionUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const id_usuarios = req.usuario.id_usuario;
        
        const calificacion = await calificacionModel.obtenerCalificacionUsuario(id_usuarios, id);
        res.json({ data: calificacion || null });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        await calificacionModel.eliminar(id);
        res.json({ message: 'Calificación eliminada' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerTodas = async (req, res) => {
    try {
        const calificaciones = await calificacionModel.obtenerTodas();
        res.json({ data: calificaciones });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { crear, obtenerPorLibro, obtenerCalificacionUsuario, eliminar, obtenerTodas };
