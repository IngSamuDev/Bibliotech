const pool = require('../config/db');

const obtenerPorLibro = async (id_libros) => {
    const result = await pool.query(`
        SELECT c.* FROM categorias c
        JOIN libro_categoria lc ON c.id_categorias = lc.id_categorias
        WHERE lc.id_libros = $1
    `, [id_libros]);
    return result.rows;
};

const agregar = async (id_libros, id_categorias) => {
    const result = await pool.query(
        'INSERT INTO libro_categoria (id_libros, id_categorias) VALUES ($1, $2) RETURNING *',
        [id_libros, id_categorias]
    );
    return result.rows[0];
};

const eliminar = async (id_libros, id_categorias) => {
    const result = await pool.query(
        'DELETE FROM libro_categoria WHERE id_libros = $1 AND id_categorias = $2 RETURNING *',
        [id_libros, id_categorias]
    );
    return result.rows[0];
};

module.exports = { obtenerPorLibro, agregar, eliminar };