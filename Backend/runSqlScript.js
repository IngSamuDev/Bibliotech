const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function runScript() {
    try {
        const sqlPath = path.join(__dirname, 'db', 'add_ratings.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        await pool.query(sql);
        console.log('✅ Tabla de calificaciones creada exitosamente');
        
        const result = await pool.query('SELECT COUNT(*) FROM calificaciones');
        console.log(`📊 Total de calificaciones: ${result.rows[0].count}`);
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

runScript();
