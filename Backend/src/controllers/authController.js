const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { crearUsuario, buscarPorEmail } = require('../models/usuarioModel');
require('dotenv').config();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

const registro = async (req, res) => {
    try {
        const nombre = req.body.nombre?.trim();
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }
        if (nombre.length < 3) {
            return res.status(400).json({ message: 'El nombre debe tener al menos 3 caracteres' });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Ingresa un correo electrónico válido' });
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: 'La contraseña debe tener mínimo 6 caracteres, una letra y un número' });
        }

        const usuarioExiste = await buscarPorEmail(email);
        if (usuarioExiste) return res.status(400).json({ message: 'El email ya está registrado' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const nuevoUsuario = await crearUsuario(nombre, email, passwordHash, 3);

        res.status(201).json({ message: 'Usuario registrado correctamente', data: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const { password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Ingresa un correo electrónico válido' });
        }

        const usuario = await buscarPorEmail(email);
        if (!usuario || !usuario.estado_usuarios) {
            return res.status(401).json({ message: 'Credenciales incorrectas o usuario desactivado' });
        }

        const passwordValida = await bcrypt.compare(password, usuario.password_usuarios);
        if (!passwordValida) return res.status(401).json({ message: 'Credenciales incorrectas' });

        const token = jwt.sign(
            { id_usuario: usuario.id_usuarios, rol: usuario.nombre_roles, email: usuario.email_usuarios },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            message: 'Login exitoso',
            token,
            usuario: { id: usuario.id_usuarios, nombre: usuario.nombre_usuarios, rol: usuario.nombre_roles }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { registro, login };
