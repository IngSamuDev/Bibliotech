const tieneRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(500).json({ message: "Error: No se encontró información del usuario" });
        }

        // Si el rol del usuario (ej: 1) está en la lista de permitidos (ej:)
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            return res.status(403).json({
                message: "Acceso denegado: No tienes permisos suficientes"
            });
        }

        next();
    };
};

module.exports = tieneRol;