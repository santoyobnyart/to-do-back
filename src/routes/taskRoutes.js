// taskRoutes.js
const express = require('express');
const { getAllTasks, addTask, updateTask, deleteTask, getTask } = require('../controllers/taskController');
const authenticate = require('../middlewares/authenticate'); // Middleware de autenticación
const router = express.Router();

// Ruta para obtener todas las tareas del usuario autenticado
router.get('/', authenticate, getAllTasks);

// Ruta para crear una nueva tarea para el usuario autenticado
router.post('/', authenticate, addTask);

// Ruta para actualizar una tarea específica por ID para el usuario autenticado
router.put('/:id', authenticate, updateTask);

// Ruta para eliminar una tarea específica por ID para el usuario autenticado
router.delete('/:id', authenticate, deleteTask);

// Nota: La ruta para obtener una tarea específica (getTask) no está expuesta en las rutas principales,
// pero se usa internamente en el controlador para verificar pertenencia. Si necesitas una ruta GET /:id,
// puedes añadirla aquí: router.get('/:id', authenticate, getTask);

module.exports = router;
