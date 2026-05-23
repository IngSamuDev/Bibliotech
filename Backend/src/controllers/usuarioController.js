const bcrypt = require('bcryptjs');
const usuarioModel = require('../models/usuarioModel');

const listar = async (req, res) => {
    try {
        const usuarios = await usuarioModel.obtenerTodos();
        res.json({ data: usuarios });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const obtenerUno = async (req, res) => {
    try {
        const usuario = await usuarioModel.obtenerPorId(req.params.id);
        if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ data: usuario });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const crear = async (req, res) => {
    try {
        const { nombre, email, password, id_roles } = req.body;
        if (!nombre || !email || !password || !id_roles) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }
        const existe = await usuarioModel.buscarPorEmail(email);
        if (existe) return res.status(400).json({ message: 'El email ya está registrado' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const nuevo = await usuarioModel.crearUsuario(nombre, email, passwordHash, id_roles);
        res.status(201).json({ message: 'Usuario creado correctamente', data: nuevo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const actualizar = async (req, res) => {
    try {
        const usuarioActual = await usuarioModel.obtenerPorId(req.params.id);
        if (!usuarioActual) return res.status(404).json({ message: 'Usuario no encontrado' });

        const nombre = req.body.nombre || usuarioActual.nombre_usuarios;
        const email = req.body.email || usuarioActual.email_usuarios;
        const id_roles = req.body.id_roles || usuarioActual.id_roles;

        const actualizado = await usuarioModel.actualizar(req.params.id, nombre, email, id_roles);
        res.json({ message: 'Usuario actualizado correctamente', data: actualizado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const cambiarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado_usuarios } = req.body;

        if (estado_usuarios === undefined) {
            return res.status(400).json({ message: 'El campo estado_usuarios es obligatorio' });
        }

        const actualizado = await usuarioModel.cambiarEstado(id, estado_usuarios);

        if (!actualizado) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.json({
            message: estado_usuarios ? 'Usuario activado correctamente' : 'Usuario desactivado correctamente',
            data: actualizado
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const eliminado = await usuarioModel.eliminar(req.params.id);
        if (!eliminado) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ message: 'Usuario eliminado correctamente', data: eliminado });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { listar, obtenerUno, crear, actualizar, cambiarEstado, eliminar };