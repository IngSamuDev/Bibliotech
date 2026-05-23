const pool = require('./db');

const ensureSchema = async () => {
    await pool.query(`
        ALTER TABLE usuarios
        ADD COLUMN IF NOT EXISTS auth_provider_usuarios VARCHAR(20) DEFAULT 'normal'
    `);

    await pool.query(`
        UPDATE usuarios
        SET auth_provider_usuarios = 'normal'
        WHERE auth_provider_usuarios IS NULL
    `);

    await pool.query(`
        CREATE TABLE IF NOT EXISTS calificaciones (
            id_calificaciones SERIAL PRIMARY KEY,
            id_usuarios INTEGER NOT NULL REFERENCES usuarios(id_usuarios) ON DELETE CASCADE,
            id_libros INTEGER NOT NULL REFERENCES libros(id_libros) ON DELETE CASCADE,
            puntuacion_calificaciones INTEGER NOT NULL CHECK (puntuacion_calificaciones BETWEEN 1 AND 5),
            comentario_calificaciones TEXT,
            fecha_calificacion_calificaciones TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (id_usuarios, id_libros)
        )
    `);

    await pool.query(`
        ALTER TABLE calificaciones
        ADD COLUMN IF NOT EXISTS comentario_calificaciones TEXT
    `);
};

module.exports = ensureSchema;
