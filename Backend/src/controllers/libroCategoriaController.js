const libroCategoriaModel = require('../models/libroCategoriaModel');

const obtenerPorLibro = async (req, res) => {
    try {
        const data = await libroCategoriaModel.obtenerPorLibro(req.params.id_libros);
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const agregar = async (req, res) => {
    try {
        const { id_libros, id_categorias } = req.body;
        if (!id_libros || !id_categorias) {
            return res.status(400).json({ message: 'id_libros e id_categorias son obligatorios' });
        }
        const data = await libroCategoriaModel.agregar(id_libros, id_categorias);
        res.status(201).json({ message: 'Categoría asociada al libro correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const { id_libros, id_categorias } = req.body;
        if (!id_libros || !id_categorias) {
            return res.status(400).json({ message: 'id_libros e id_categorias son obligatorios' });
        }
        const data = await libroCategoriaModel.eliminar(id_libros, id_categorias);
        if (!data) return res.status(404).json({ message: 'Relación no encontrada' });
        res.json({ message: 'Categoría desasociada del libro correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { obtenerPorLibro, agregar, eliminar };