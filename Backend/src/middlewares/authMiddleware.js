const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token no proporcionado o formato inválido' });
    }

    try {
        const token = authHeader.replace('Bearer ', '').trim();

        if (!token) {
            return res.status(401).json({ message: 'Token vacío' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.usuario = decoded;
        next();
    } catch (error) {
        console.error("DEBUG - Error en JWT:", error.message);
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

const verificarTokenOpcional = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
        req.usuario = null;
        return next();
    }

    try {
        const token = authHeader.replace('Bearer ', '').trim();

        if (!token) {
            req.usuario = null;
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        console.error("DEBUG - Error en JWT Opcional:", error.message);
        req.usuario = null;
        next();
    }
};

const autorizar = (...rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario || !rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                message: `Acceso denegado. Se requiere rol: ${rolesPermitidos.join(' o ')}`
            });
        }
        next();
    };
};

module.exports = { verificarToken, verificarTokenOpcional, autorizar };