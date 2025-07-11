const pool = require('../config/db');

//Creacion de usuario

const createUser = async (user) => {
    const { username, email, password } = user;
    const [result] = await pool.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, password]);
    return { id: result.insertId, username, email };
};

// Buscando al usuario por Correo electronico
const getUserByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

module.exports = {createUser, getUserByEmail};