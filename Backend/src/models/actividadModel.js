const pool = require('../config/db');

const obtenerTodos = async () => {
    const result = await pool.query(`
        SELECT a.*, u.nombre_usuarios
        FROM actividad_sistema a
        LEFT JOIN usuarios u ON a.id_usuarios = u.id_usuarios
        ORDER BY a.fecha_actividad_sistema DESC
    `);
    return result.rows;
};

const registrar = async (id_usuarios, accion, descripcion) => {
    const result = await pool.query(`
        INSERT INTO actividad_sistema (id_usuarios, accion_actividad_sistema, descripcion_actividad_sistema)
        VALUES ($1, $2, $3) RETURNING *
    `, [id_usuarios, accion, descripcion]);
    return result.rows;
};

const eliminar = async (id) => {
    const result = await pool.query(
        'DELETE FROM actividad_sistema WHERE id_actividad_sistema = $1 RETURNING *',
        [id]
    );
    return result.rows;
};

module.exports = { obtenerTodos, registrar, eliminar };