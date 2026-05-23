const autorModel = require('../models/autorModel');

const listar = async (req, res) => {
    try {
        const data = await autorModel.obtenerTodos();
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerUno = async (req, res) => {
    try {
        const data = await autorModel.obtenerPorId(req.params.id);
        if (!data) return res.status(404).json({ message: 'Autor no encontrado' });
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const crear = async (req, res) => {
    try {
        const { nombre_autores, nacionalidad_autores } = req.body;
        if (!nombre_autores) return res.status(400).json({ message: 'El nombre es obligatorio' });
        const data = await autorModel.crear(nombre_autores, nacionalidad_autores);
        res.status(201).json({ message: 'Autor creado correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizar = async (req, res) => {
    try {
        const { nombre_autores, nacionalidad_autores } = req.body;
        const data = await autorModel.actualizar(req.params.id, nombre_autores, nacionalidad_autores);
        if (!data) return res.status(404).json({ message: 'Autor no encontrado' });
        res.json({ message: 'Autor actualizado correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const data = await autorModel.eliminar(req.params.id);
        if (!data) return res.status(404).json({ message: 'Autor no encontrado' });
        res.json({ message: 'Autor eliminado correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { listar, obtenerUno, crear, actualizar, eliminar };