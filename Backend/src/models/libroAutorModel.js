const pool = require('../config/db');

const obtenerPorLibro = async (id_libros) => {
    const result = await pool.query(`
        SELECT a.* FROM autores a
        JOIN libro_autor la ON a.id_autores = la.id_autores
        WHERE la.id_libros = $1
    `, [id_libros]);
    return result.rows;
};

const agregar = async (id_libros, id_autores) => {
    const result = await pool.query(
        'INSERT INTO libro_autor (id_libros, id_autores) VALUES ($1, $2) RETURNING *',
        [id_libros, id_autores]
    );
    return result.rows[0];
};

const eliminar = async (id_libros, id_autores) => {
    const result = await pool.query(
        'DELETE FROM libro_autor WHERE id_libros = $1 AND id_autores = $2 RETURNING *',
        [id_libros, id_autores]
    );
    return result.rows[0];
};

module.exports = { obtenerPorLibro, agregar, eliminar };