const visualizacionModel = require('../models/visualizacionModel');

const listar = async (req, res) => {
    try {
        const data = await visualizacionModel.obtenerTodos();
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const miHistorial = async (req, res) => {
    try {
        const data = await visualizacionModel.obtenerPorUsuario(req.usuario.id_usuario);
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const registrar = async (req, res) => {
    try {
        const { id_libros } = req.body;
        if (!id_libros) return res.status(400).json({ message: 'id_libros es obligatorio' });
        
        const id_usuarios = req.usuario ? req.usuario.id_usuario : 1;
        const data = await visualizacionModel.registrar(id_usuarios, id_libros);
        res.status(201).json({ message: 'Visualización registrada correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const data = await visualizacionModel.eliminar(req.params.id);
        if (!data) return res.status(404).json({ message: 'Visualización no encontrada' });
        res.json({ message: 'Visualización eliminada correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { listar, miHistorial, registrar, eliminar };