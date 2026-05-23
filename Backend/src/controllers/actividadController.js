const actividadModel = require('../models/actividadModel');

const listar = async (req, res) => {
    try {
        const data = await actividadModel.obtenerTodos();
        res.json({ data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const registrar = async (req, res) => {
    try {
        const { accion_actividad_sistema, descripcion_actividad_sistema } = req.body;

        if (!accion_actividad_sistema) {
            return res.status(400).json({ message: 'La acción es obligatoria' });
        }

        const id_usuario_logueado = req.usuario.id || req.usuario.id_usuarios;

        const data = await actividadModel.registrar(
            id_usuario_logueado,
            accion_actividad_sistema,
            descripcion_actividad_sistema
        );

        res.status(201).json({ message: 'Actividad registrada correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const data = await actividadModel.eliminar(req.params.id);
        if (!data) return res.status(404).json({ message: 'Actividad no encontrada' });
        res.json({ message: 'Actividad eliminada correctamente', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { listar, registrar, eliminar };