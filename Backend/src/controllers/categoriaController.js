const categoriaModel = require('../models/categoriaModel');

const listar = async (req, res) => {
    try {
        const data = await categoriaModel.obtenerTodos();
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerUno = async (req, res) => {
    try {
        const data = await categoriaModel.obtenerPorId(req.params.id);
        if (!data) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const crear = async (req, res) => {
    try {
        const { nombre_categorias, descripcion_categorias } = req.body;
        if (!nombre_categorias) return res.status(400).json({ message: 'El nombre es obligatorio' });
        const data = await categoriaModel.crear(nombre_categorias, descripcion_categorias);
        res.status(201).json({ message: 'Categoría creada correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizar = async (req, res) => {
    try {
        const { nombre_categorias, descripcion_categorias } = req.body;
        const data = await categoriaModel.actualizar(req.params.id, nombre_categorias, descripcion_categorias);
        if (!data) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.json({ message: 'Categoría actualizada correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const data = await categoriaModel.eliminar(req.params.id);
        if (!data) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.json({ message: 'Categoría eliminada correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { listar, obtenerUno, crear, actualizar, eliminar };