const pool = require('../config/db');

const obtenerTodos = async () => {
    const result = await pool.query('SELECT * FROM roles ORDER BY id_roles');
    return result.rows;
};

const obtenerPorId = async (id) => {
    const result = await pool.query('SELECT * FROM roles WHERE id_roles = $1', [id]);
    return result.rows[0];
};

const crear = async (nombre_roles, descripcion_roles) => {
    const result = await pool.query(
        'INSERT INTO roles (nombre_roles, descripcion_roles) VALUES ($1, $2) RETURNING *',
        [nombre_roles, descripcion_roles]
    );
    return result.rows[0];
};

const actualizar = async (id, nombre_roles, descripcion_roles) => {
    const result = await pool.query(
        'UPDATE roles SET nombre_roles = $1, descripcion_roles = $2 WHERE id_roles = $3 RETURNING *',
        [nombre_roles, descripcion_roles, id]
    );
    return result.rows[0];
};

const eliminar = async (id) => {
    const result = await pool.query(
        'DELETE FROM roles WHERE id_roles = $1 RETURNING *',
        [id]
    );
    return result.rows[0];
};

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };