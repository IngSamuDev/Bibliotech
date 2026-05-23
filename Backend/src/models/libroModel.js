const pool = require('../config/db');

const obtenerTodos = async () => {
    const result = await pool.query(`
        SELECT l.*, u.nombre_usuarios as subido_por,
            COALESCE(COUNT(DISTINCT d.id_descargas), 0)::int as descargas,
            COALESCE(COUNT(DISTINCT v.id_visualizaciones), 0)::int as lecturas,
            COALESCE(AVG(cal.puntuacion_calificaciones), 0) as rating_promedio,
            COALESCE(COUNT(DISTINCT cal.id_calificaciones), 0)::int as total_calificaciones,
            COALESCE(
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id_autores', a.id_autores, 'nombre_autores', a.nombre_autores))
                FILTER (WHERE a.id_autores IS NOT NULL), '[]'
            ) as autores,
            COALESCE(
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id_categorias', c.id_categorias, 'nombre_categorias', c.nombre_categorias))
                FILTER (WHERE c.id_categorias IS NOT NULL), '[]'
            ) as categorias
        FROM libros l
        JOIN usuarios u ON l.id_usuarios = u.id_usuarios
        LEFT JOIN descargas d ON d.id_libros = l.id_libros
        LEFT JOIN visualizaciones v ON v.id_libros = l.id_libros
        LEFT JOIN calificaciones cal ON cal.id_libros = l.id_libros
        LEFT JOIN libro_autor la ON la.id_libros = l.id_libros
        LEFT JOIN autores a ON a.id_autores = la.id_autores
        LEFT JOIN libro_categoria lc ON lc.id_libros = l.id_libros
        LEFT JOIN categorias c ON c.id_categorias = lc.id_categorias
        WHERE l.activo_libros = true
        GROUP BY l.id_libros, u.nombre_usuarios
        ORDER BY l.id_libros
    `);
    return result.rows;
};

const obtenerTodosAdmin = async () => {
    const result = await pool.query(`
        SELECT l.*, u.nombre_usuarios as subido_por,
            COALESCE(COUNT(DISTINCT d.id_descargas), 0)::int as descargas,
            COALESCE(COUNT(DISTINCT v.id_visualizaciones), 0)::int as lecturas,
            COALESCE(AVG(cal.puntuacion_calificaciones), 0) as rating_promedio,
            COALESCE(COUNT(DISTINCT cal.id_calificaciones), 0)::int as total_calificaciones,
            COALESCE(
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id_autores', a.id_autores, 'nombre_autores', a.nombre_autores))
                FILTER (WHERE a.id_autores IS NOT NULL), '[]'
            ) as autores,
            COALESCE(
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id_categorias', c.id_categorias, 'nombre_categorias', c.nombre_categorias))
                FILTER (WHERE c.id_categorias IS NOT NULL), '[]'
            ) as categorias
        FROM libros l
        JOIN usuarios u ON l.id_usuarios = u.id_usuarios
        LEFT JOIN descargas d ON d.id_libros = l.id_libros
        LEFT JOIN visualizaciones v ON v.id_libros = l.id_libros
        LEFT JOIN calificaciones cal ON cal.id_libros = l.id_libros
        LEFT JOIN libro_autor la ON la.id_libros = l.id_libros
        LEFT JOIN autores a ON a.id_autores = la.id_autores
        LEFT JOIN libro_categoria lc ON lc.id_libros = l.id_libros
        LEFT JOIN categorias c ON c.id_categorias = lc.id_categorias
        GROUP BY l.id_libros, u.nombre_usuarios
        ORDER BY l.id_libros DESC
    `);
    return result.rows;
};

const obtenerPorId = async (id) => {
    const result = await pool.query(`
        SELECT l.*, u.nombre_usuarios as subido_por,
            COALESCE(COUNT(DISTINCT d.id_descargas), 0)::int as descargas,
            COALESCE(COUNT(DISTINCT v.id_visualizaciones), 0)::int as lecturas,
            COALESCE(AVG(cal.puntuacion_calificaciones), 0) as rating_promedio,
            COALESCE(COUNT(DISTINCT cal.id_calificaciones), 0)::int as total_calificaciones,
            COALESCE(
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id_autores', a.id_autores, 'nombre_autores', a.nombre_autores))
                FILTER (WHERE a.id_autores IS NOT NULL), '[]'
            ) as autores,
            COALESCE(
                JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id_categorias', c.id_categorias, 'nombre_categorias', c.nombre_categorias))
                FILTER (WHERE c.id_categorias IS NOT NULL), '[]'
            ) as categorias
        FROM libros l
        JOIN usuarios u ON l.id_usuarios = u.id_usuarios
        LEFT JOIN descargas d ON d.id_libros = l.id_libros
        LEFT JOIN visualizaciones v ON v.id_libros = l.id_libros
        LEFT JOIN calificaciones cal ON cal.id_libros = l.id_libros
        LEFT JOIN libro_autor la ON la.id_libros = l.id_libros
        LEFT JOIN autores a ON a.id_autores = la.id_autores
        LEFT JOIN libro_categoria lc ON lc.id_libros = l.id_libros
        LEFT JOIN categorias c ON c.id_categorias = lc.id_categorias
        WHERE l.id_libros = $1
        GROUP BY l.id_libros, u.nombre_usuarios
    `, [id]);
    return result.rows[0];
};

const crear = async (titulo, descripcion, anio, archivo_url, portada_url, id_usuarios) => {
    const result = await pool.query(`
        INSERT INTO libros (titulo_libros, descripcion_libros, anio_publicacion_libros, archivo_url_libros, portada_url_libros, id_usuarios)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `, [titulo, descripcion, anio, archivo_url, portada_url, id_usuarios]);
    return result.rows[0];
};

const actualizar = async (id, titulo, descripcion, anio, archivo_url, portada_url) => {
    const result = await pool.query(`
        UPDATE libros SET titulo_libros = $1, descripcion_libros = $2, 
        anio_publicacion_libros = $3, archivo_url_libros = $4, portada_url_libros = $5
        WHERE id_libros = $6 RETURNING *
    `, [titulo, descripcion, anio, archivo_url, portada_url, id]);
    return result.rows[0];
};

const eliminar = async (id) => {
    const result = await pool.query(
        'UPDATE libros SET activo_libros = false WHERE id_libros = $1 RETURNING *', [id]
    );
    return result.rows[0];
};

const cambiarEstado = async (id, estado) => {
    const result = await pool.query(
        'UPDATE libros SET activo_libros = $1 WHERE id_libros = $2 RETURNING *',
        [estado, id]
    );
    return result.rows[0];
};

const sincronizarAutores = async (id_libros, autores = []) => {
    await pool.query('DELETE FROM libro_autor WHERE id_libros = $1', [id_libros]);
    for (const id_autores of autores) {
        await pool.query(
            'INSERT INTO libro_autor (id_libros, id_autores) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [id_libros, id_autores]
        );
    }
};

const sincronizarCategorias = async (id_libros, categorias = []) => {
    await pool.query('DELETE FROM libro_categoria WHERE id_libros = $1', [id_libros]);
    for (const id_categorias of categorias) {
        await pool.query(
            'INSERT INTO libro_categoria (id_libros, id_categorias) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [id_libros, id_categorias]
        );
    }
};

module.exports = { obtenerTodos, obtenerTodosAdmin, obtenerPorId, crear, actualizar, eliminar, cambiarEstado, sincronizarAutores, sincronizarCategorias };
