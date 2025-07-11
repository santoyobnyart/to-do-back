const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});


//test de conexión
(async () => {
    try{
        const connection = await pool.getConnection();
        console.log('La base de datos está conectada');
        connection.release();
    } catch (error) {
        console.error('Error al conectar la base de datos', error.message);
    }
})();

module.exports = pool;