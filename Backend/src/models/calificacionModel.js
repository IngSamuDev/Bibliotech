const pool = require('../config/db');

const crear = async (id_usuarios, id_libros, puntuacion, comentario) => {
    const query = `
        INSERT INTO calificaciones (id_usuarios, id_libros, puntuacion_calificaciones, comentario_calificaciones)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (id_usuarios, id_libros) 
        DO UPDATE SET puntuacion_calificaciones = $3, comentario_calificaciones = $4, fecha_calificacion_calificaciones = CURRENT_TIMESTAMP
        RETURNING *
    `;
    const result = await pool.query(query, [id_usuarios, id_libros, puntuacion, comentario]);
    return result.rows[0];
};

const obtenerPorLibro = async (id_libros) => {
    const query = `
        SELECT c.*, u.nombre_usuarios, u.email_usuarios
        FROM calificaciones c
        JOIN usuarios u ON c.id_usuarios = u.id_usuarios
        WHERE c.id_libros = $1
        ORDER BY c.fecha_calificacion_calificaciones DESC
    `;
    const result = await pool.query(query, [id_libros]);
    return result.rows;
};

const obtenerPromedioLibro = async (id_libros) => {
    const query = `
        SELECT 
            COALESCE(AVG(puntuacion_calificaciones), 0) as promedio,
            COUNT(*) as total_calificaciones
        FROM calificaciones
        WHERE id_libros = $1
    `;
    const result = await pool.query(query, [id_libros]);
    return result.rows[0];
};

const obtenerCalificacionUsuario = async (id_usuarios, id_libros) => {
    const query = `
        SELECT * FROM calificaciones
        WHERE id_usuarios = $1 AND id_libros = $2
    `;
    const result = await pool.query(query, [id_usuarios, id_libros]);
    return result.rows[0];
};

const obtenerTodas = async () => {
    const query = `
        SELECT c.*, u.nombre_usuarios, u.email_usuarios, l.titulo_libros
        FROM calificaciones c
        JOIN usuarios u ON c.id_usuarios = u.id_usuarios
        JOIN libros l ON c.id_libros = l.id_libros
        ORDER BY c.fecha_calificacion_calificaciones DESC
    `;
    const result = await pool.query(query);
    return result.rows;
};

const eliminar = async (id_calificaciones) => {
    const result = await pool.query(
        'DELETE FROM calificaciones WHERE id_calificaciones = $1 RETURNING *',
        [id_calificaciones]
    );
    return result.rows[0];
};

module.exports = {
    crear,
    obtenerPorLibro,
    obtenerPromedioLibro,
    obtenerCalificacionUsuario,
    obtenerTodas,
    eliminar
};
