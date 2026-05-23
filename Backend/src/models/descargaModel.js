const pool = require('../config/db');

const obtenerTodos = async () => {
    const result = await pool.query(`
        SELECT d.*, u.nombre_usuarios, l.titulo_libros
        FROM descargas d
        JOIN usuarios u ON d.id_usuarios = u.id_usuarios
        JOIN libros l ON d.id_libros = l.id_libros
        ORDER BY d.fecha_descarga_descargas DESC
    `);
    return result.rows;
};

const obtenerPorUsuario = async (id_usuarios) => {
    const result = await pool.query(`
        SELECT d.*, l.titulo_libros
        FROM descargas d
        JOIN libros l ON d.id_libros = l.id_libros
        WHERE d.id_usuarios = $1
        ORDER BY d.fecha_descarga_descargas DESC
    `, [id_usuarios]);
    return result.rows;
};

const registrar = async (id_usuarios, id_libros) => {
    const result = await pool.query(
        'INSERT INTO descargas (id_usuarios, id_libros) VALUES ($1, $2) RETURNING *',
        [id_usuarios, id_libros]
    );
    return result.rows[0];
};

const eliminar = async (id) => {
    const result = await pool.query(
        'DELETE FROM descargas WHERE id_descargas = $1 RETURNING *', [id]
    );
    return result.rows[0];
};

module.exports = { obtenerTodos, obtenerPorUsuario, registrar, eliminar };