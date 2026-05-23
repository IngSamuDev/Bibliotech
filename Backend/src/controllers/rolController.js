    const rolModel = require('../models/rolModel');

    const listar = async (req, res) => {
        try {
            const roles = await rolModel.obtenerTodos();
            res.json({ data: roles });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    const obtenerUno = async (req, res) => {
        try {
            const rol = await rolModel.obtenerPorId(req.params.id);
            if (!rol) return res.status(404).json({ message: 'Rol no encontrado' });
            res.json({ data: rol });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    const crear = async (req, res) => {
        try {
            const { nombre_roles, descripcion_roles } = req.body;
            if (!nombre_roles) return res.status(400).json({ message: 'El nombre del rol es obligatorio' });
            const nuevo = await rolModel.crear(nombre_roles, descripcion_roles);
            res.status(201).json({ message: 'Rol creado correctamente', data: nuevo });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    const actualizar = async (req, res) => {
        try {
            const { nombre_roles, descripcion_roles } = req.body;
            const actualizado = await rolModel.actualizar(req.params.id, nombre_roles, descripcion_roles);
            if (!actualizado) return res.status(404).json({ message: 'Rol no encontrado' });
            res.json({ message: 'Rol actualizado correctamente', data: actualizado });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    const eliminar = async (req, res) => {
        try {
            const eliminado = await rolModel.eliminar(req.params.id);
            if (!eliminado) return res.status(404).json({ message: 'Rol no encontrado' });
            res.json({ message: 'Rol eliminado correctamente', data: eliminado });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    module.exports = { listar, obtenerUno, crear, actualizar, eliminar };