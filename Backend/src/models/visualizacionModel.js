const pool = require('../config/db');

const obtenerTodos = async () => {
    const result = await pool.query(`
        SELECT v.*, u.nombre_usuarios, l.titulo_libros
        FROM visualizaciones v
        JOIN usuarios u ON v.id_usuarios = u.id_usuarios
        JOIN libros l ON v.id_libros = l.id_libros
        ORDER BY v.fecha_visualizacion_visualizaciones DESC
    `);
    return result.rows;
};

const obtenerPorUsuario = async (id_usuarios) => {
    const result = await pool.query(`
        SELECT v.*, l.titulo_libros
        FROM visualizaciones v
        JOIN libros l ON v.id_libros = l.id_libros
        WHERE v.id_usuarios = $1
        ORDER BY v.fecha_visualizacion_visualizaciones DESC
    `, [id_usuarios]);
    return result.rows;
};

const registrar = async (id_usuarios, id_libros) => {
    const result = await pool.query(
        'INSERT INTO visualizaciones (id_usuarios, id_libros) VALUES ($1, $2) RETURNING *',
        [id_usuarios, id_libros]
    );
    return result.rows[0];
};

const eliminar = async (id) => {
    const result = await pool.query(
        'DELETE FROM visualizaciones WHERE id_visualizaciones = $1 RETURNING *', [id]
    );
    return result.rows[0];
};

module.exports = { obtenerTodos, obtenerPorUsuario, registrar, eliminar };