const libroAutorModel = require('../models/libroAutorModel');

const obtenerPorLibro = async (req, res) => {
    try {
        const data = await libroAutorModel.obtenerPorLibro(req.params.id_libros);
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const agregar = async (req, res) => {
    try {
        const { id_libros, id_autores } = req.body;
        if (!id_libros || !id_autores) {
            return res.status(400).json({ message: 'id_libros e id_autores son obligatorios' });
        }
        const data = await libroAutorModel.agregar(id_libros, id_autores);
        res.status(201).json({ message: 'Autor asociado al libro correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const { id_libros, id_autores } = req.body;
        if (!id_libros || !id_autores) {
            return res.status(400).json({ message: 'id_libros e id_autores son obligatorios' });
        }
        const data = await libroAutorModel.eliminar(id_libros, id_autores);
        if (!data) return res.status(404).json({ message: 'Relación no encontrada' });
        res.json({ message: 'Autor desasociado del libro correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { obtenerPorLibro, agregar, eliminar };