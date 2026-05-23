const pool = require('../config/db');

const crearUsuario = async (nombre, email, password, id_roles, auth_provider = 'normal') => {
    const query = `
        INSERT INTO usuarios (nombre_usuarios, email_usuarios, password_usuarios, id_roles, auth_provider_usuarios)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id_usuarios, nombre_usuarios, email_usuarios, id_roles, auth_provider_usuarios
    `;
    const result = await pool.query(query, [nombre, email, password, id_roles, auth_provider]);
    return result.rows[0];
};

const buscarPorEmail = async (email) => {
    const query = `
        SELECT u.*, r.nombre_roles 
        FROM usuarios u
        JOIN roles r ON u.id_roles = r.id_roles
        WHERE u.email_usuarios = $1
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

const buscarPorId = async (id) => {
    const query = `
        SELECT u.*, r.nombre_roles 
        FROM usuarios u
        JOIN roles r ON u.id_roles = r.id_roles
        WHERE u.id_usuarios = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const obtenerTodos = async () => {
    const query = `
        SELECT u.id_usuarios, u.nombre_usuarios, u.email_usuarios, 
               u.estado_usuarios, u.fecha_creacion_usuarios, u.auth_provider_usuarios, r.nombre_roles
        FROM usuarios u
        JOIN roles r ON u.id_roles = r.id_roles
        ORDER BY u.id_usuarios
    `;
    const result = await pool.query(query);
    return result.rows;
};

const obtenerPorId = async (id) => {
    const query = `
        SELECT u.id_usuarios, u.nombre_usuarios, u.email_usuarios, 
               u.estado_usuarios, u.fecha_creacion_usuarios, u.auth_provider_usuarios, r.id_roles, r.nombre_roles
        FROM usuarios u
        JOIN roles r ON u.id_roles = r.id_roles
        WHERE u.id_usuarios = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const actualizar = async (id, nombre, email, id_roles) => {
    const result = await pool.query(
        `UPDATE usuarios SET nombre_usuarios = $1, email_usuarios = $2, id_roles = $3 
         WHERE id_usuarios = $4 RETURNING *`,
        [nombre, email, id_roles, id]
    );
    return result.rows[0];
};

const cambiarEstado = async (id, estado) => {
    const result = await pool.query(
        'UPDATE usuarios SET estado_usuarios = $1 WHERE id_usuarios = $2 RETURNING *',
        [estado, id]
    );
    return result.rows[0];
};

const eliminar = async (id) => {
    const result = await pool.query(
        'DELETE FROM usuarios WHERE id_usuarios = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};

module.exports = {
    crearUsuario, buscarPorEmail, buscarPorId, obtenerTodos,
    obtenerPorId, actualizar, cambiarEstado, eliminar
};
