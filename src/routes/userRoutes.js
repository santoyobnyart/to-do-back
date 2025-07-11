const express = require('express');
const { registerUser } = require('../controllers/userController');
const router = express.Router();

// Ruta para nuevo usuario
router.post('/register', registerUser);

// Exportación de ruta

module.exports = router;

