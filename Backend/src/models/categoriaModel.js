const pool = require('../config/db');

const obtenerTodos = async () => {
    const result = await pool.query(`
        SELECT c.*, COALESCE(COUNT(lc.id_libros), 0)::int as libros
        FROM categorias c
        LEFT JOIN libro_categoria lc ON lc.id_categorias = c.id_categorias
        GROUP BY c.id_categorias
        ORDER BY c.id_categorias
    `);
    return result.rows;
};

const obtenerPorId = async (id) => {
    const result = await pool.query('SELECT * FROM categorias WHERE id_categorias = $1', [id]);
    return result.rows[0];
};

const crear = async (nombre_categorias, descripcion_categorias) => {
    const result = await pool.query(
        'INSERT INTO categorias (nombre_categorias, descripcion_categorias) VALUES ($1, $2) RETURNING *',
        [nombre_categorias, descripcion_categorias]
    );
    return result.rows[0];
};

const actualizar = async (id, nombre_categorias, descripcion_categorias) => {
    const result = await pool.query(
        'UPDATE categorias SET nombre_categorias = $1, descripcion_categorias = $2 WHERE id_categorias = $3 RETURNING *',
        [nombre_categorias, descripcion_categorias, id]
    );
    return result.rows[0];
};

const eliminar = async (id) => {
    const result = await pool.query('DELETE FROM categorias WHERE id_categorias = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
