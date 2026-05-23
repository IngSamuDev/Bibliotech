const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function checkTables() {
    try {
        const result = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `);
        
        console.log('📋 Tablas en la base de datos:');
        result.rows.forEach(row => console.log(`  - ${row.table_name}`));
        
        // Check if calificaciones exists
        const calCheck = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'calificaciones'
            ORDER BY ordinal_position
        `);
        
        if (calCheck.rows.length > 0) {
            console.log('\n📊 Estructura de tabla calificaciones:');
            calCheck.rows.forEach(col => console.log(`  - ${col.column_name}: ${col.data_type}`));
        } else {
            console.log('\n⚠️  La tabla calificaciones no existe');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await pool.end();
    }
}

checkTables();
