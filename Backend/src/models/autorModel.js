const pool = require('../config/db');

const obtenerTodos = async () => {
    const result = await pool.query(`
        SELECT a.*, COALESCE(COUNT(la.id_libros), 0)::int as libros
        FROM autores a
        LEFT JOIN libro_autor la ON la.id_autores = a.id_autores
        GROUP BY a.id_autores
        ORDER BY a.id_autores
    `);
    return result.rows;
};

const obtenerPorId = async (id) => {
    const result = await pool.query('SELECT * FROM autores WHERE id_autores = $1', [id]);
    return result.rows[0];
};

const crear = async (nombre_autores, nacionalidad_autores) => {
    const result = await pool.query(
        'INSERT INTO autores (nombre_autores, nacionalidad_autores) VALUES ($1, $2) RETURNING *',
        [nombre_autores, nacionalidad_autores]
    );
    return result.rows[0];
};

const actualizar = async (id, nombre_autores, nacionalidad_autores) => {
    const result = await pool.query(
        'UPDATE autores SET nombre_autores = $1, nacionalidad_autores = $2 WHERE id_autores = $3 RETURNING *',
        [nombre_autores, nacionalidad_autores, id]
    );
    return result.rows[0];
};

const eliminar = async (id) => {
    const result = await pool.query('DELETE FROM autores WHERE id_autores = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
