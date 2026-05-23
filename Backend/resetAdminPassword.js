const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function main() {
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    console.log('Hash generado para admin123:', hash);

    try {
        // Actualizar contraseña del admin
        await pool.query(
            `UPDATE usuarios SET password_usuarios = $1 WHERE email_usuarios = 'admin@bibliotech.com'`,
            [hash]
        );
        console.log('✅ Contraseña del admin actualizada correctamente');

        // Verificar que el usuario existe
        const result = await pool.query(
            `SELECT u.id_usuarios, u.nombre_usuarios, u.email_usuarios, u.estado_usuarios, r.nombre_roles 
             FROM usuarios u 
             JOIN roles r ON u.id_roles = r.id_roles 
             WHERE u.email_usuarios = 'admin@bibliotech.com'`
        );
        
        if (result.rows.length > 0) {
            console.log('👤 Usuario admin:', result.rows[0]);
        } else {
            console.log('⚠️  No se encontró el usuario admin. Creándolo...');
            await pool.query(
                `INSERT INTO usuarios (nombre_usuarios, email_usuarios, password_usuarios, id_roles, estado_usuarios) 
                 VALUES ('Admin BiblioTech', 'admin@bibliotech.com', $1, 1, true)`,
                [hash]
            );
            console.log('✅ Usuario admin creado');
        }

        // Mostrar todos los usuarios
        const allUsers = await pool.query(
            `SELECT u.id_usuarios, u.nombre_usuarios, u.email_usuarios, r.nombre_roles, u.estado_usuarios 
             FROM usuarios u JOIN roles r ON u.id_roles = r.id_roles`
        );
        console.log('\n📋 Todos los usuarios en la BD:');
        console.table(allUsers.rows);

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await pool.end();
    }
}

main();
