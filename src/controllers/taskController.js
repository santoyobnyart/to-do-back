// taskController.js
const taskModel = require('../models/taskModel');
// const pool = require('../config/db'); // No es necesario aquí, ya se usa a través del modelo

/**
 * Obtiene todas las tareas para el usuario autenticado.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const getAllTasks = async (req, res) => {
    try {
        console.log('GET /api/tasks - User ID:', req.user.id);
        const tasks = await taskModel.getAllTasksByUserId(req.user.id);
        res.json(tasks);
    } catch (error) {
        console.error('Error al obtener las tareas:', error.message);
        res.status(500).json({ message: 'Error al obtener tareas' });
    }
};

/**
 * Obtiene una tarea específica por su ID para el usuario autenticado.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const getTask = async (req, res) => {
    try {
        console.log('GET /api/tasks/:id - Task ID:', req.params.id, 'User ID:', req.user.id);
        const task = await taskModel.getTaskByIdAndUserId(req.params.id, req.user.id);
        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada o no pertenece al usuario' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error al obtener la tarea:', error);
        res.status(500).json({ message: 'Error al obtener la tarea' });
    }
};

/**
 * Agrega una nueva tarea para el usuario autenticado.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const addTask = async (req, res) => {
    const { title, description, status } = req.body;
    const userId = req.user?.id; // Acceso seguro al ID del usuario

    console.log("Recibiendo datos en backend para AGREGAR tarea:", { title, description, status, userId });

    if (!title) {
        return res.status(400).json({ message: 'El título es obligatorio' });
    }
    // Si el ID de usuario no está presente, significa que el middleware de autenticación falló
    // o el token no contenía el ID. Esto debería ser un error de autenticación.
    if (!userId) {
        console.error('Error: User ID es nulo o indefinido en addTask. Posible problema de autenticación o token.');
        return res.status(401).json({ message: 'Usuario no autenticado o ID de usuario faltante.' });
    }

    try {
        const newTask = await taskModel.createTask({
            title,
            description: description || null, // Usa null si la descripción está vacía
            status: status || "Pendiente", // Usa "Pendiente" si el estado está vacío
            user_id: userId // Asegúrate de pasar el userId
        });
        console.log("Tarea creada exitosamente en el backend:", newTask);
        res.status(201).json(newTask); // 201 Created
    } catch (error) {
        console.error("⚠ Error en el servidor al crear la tarea:", error);
        // Devuelve el mensaje de error específico de la base de datos si está disponible
        res.status(500).json({ message: 'Error al crear la tarea', error: error.message });
    }
};

/**
 * Actualiza una tarea existente para el usuario autenticado.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const updateTask = async (req, res) => {
    const { title, description, status } = req.body;
    const taskId = req.params.id;
    const userId = req.user?.id; // ID del usuario autenticado

    console.log("Recibiendo datos en backend para ACTUALIZAR tarea:", { taskId, userId, title, description, status });

    if (!userId) {
        console.error('Error: User ID es nulo o indefinido en updateTask. Posible problema de autenticación o token.');
        return res.status(401).json({ message: 'Usuario no autenticado o ID de usuario faltante.' });
    }

    try {
        // Primero, verifica si la tarea existe y pertenece al usuario
        const existingTask = await taskModel.getTaskByIdAndUserId(taskId, userId);
        if (!existingTask) {
            return res.status(404).json({ message: 'Tarea no encontrada o no pertenece al usuario' });
        }

        // Si la tarea existe y pertenece al usuario, procede a actualizarla usando el modelo
        const updatedTask = await taskModel.updateTask(taskId, { title, description: description || null, status });

        console.log("Tarea actualizada en el backend:", updatedTask);
        res.json(updatedTask); // Devuelve la tarea actualizada
    } catch (error) {
        console.error("⚠ Error en el servidor al actualizar la tarea:", error);
        res.status(500).json({ message: 'Error al actualizar la tarea', error: error.message });
    }
};

/**
 * Elimina una tarea para el usuario autenticado.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user?.id; // ID del usuario autenticado

        console.log("Recibiendo datos en backend para ELIMINAR tarea:", { taskId, userId });

        if (!userId) {
            console.error('Error: User ID es nulo o indefinido en deleteTask. Posible problema de autenticación o token.');
            return res.status(401).json({ message: 'Usuario no autenticado o ID de usuario faltante.' });
        }

        // Verifica si la tarea pertenece al usuario antes de eliminar
        const task = await taskModel.getTaskByIdAndUserId(taskId, userId);

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada o no pertenece al usuario' });
        }

        await taskModel.deleteTask(taskId);
        console.log("Tarea eliminada correctamente en el backend.");
        res.json({ message: 'Tarea eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la tarea:', error);
        res.status(500).json({ message: 'Error al eliminar la tarea', error: error.message });
    }
};

module.exports = {
    getAllTasks,
    getTask,
    addTask,
    updateTask,
    deleteTask,
};

