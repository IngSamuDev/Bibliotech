const descargaModel = require('../models/descargaModel');

const listar = async (req, res) => {
    try {
        const data = await descargaModel.obtenerTodos();
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const miHistorial = async (req, res) => {
    try {
        const data = await descargaModel.obtenerPorUsuario(req.usuario.id_usuario);
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
        const data = await descargaModel.registrar(id_usuarios, id_libros);
        res.status(201).json({ message: 'Descarga registrada correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const data = await descargaModel.eliminar(req.params.id);
        if (!data) return res.status(404).json({ message: 'Descarga no encontrada' });
        res.json({ message: 'Descarga eliminada correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { listar, miHistorial, registrar, eliminar };