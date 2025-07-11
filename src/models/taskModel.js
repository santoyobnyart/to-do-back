// taskModel.js
const pool = require('../config/db'); // Importa el pool de conexiones a la base de datos

/**
 * Obtiene todas las tareas asociadas a un ID de usuario específico.
 * @param {number} userId - El ID del usuario.
 * @returns {Promise<Array>} Un array de objetos de tareas.
 */
const getAllTasksByUserId = async (userId) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tasks WHERE user_id = ?', [userId]);
        return rows;
    } catch (error) {
        console.error('Error al obtener tareas por ID de usuario en el modelo:', error.message);
        throw error;
    }
};

/**
 * Obtiene una tarea específica por su ID y el ID del usuario al que pertenece.
 * @param {number} taskId - El ID de la tarea.
 * @param {number} userId - El ID del usuario.
 * @returns {Promise<Object|undefined>} El objeto de la tarea si se encuentra, o undefined.
 */
const getTaskByIdAndUserId = async (taskId, userId) => {
    const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);
    return rows[0]; // Devuelve la primera fila si existe, de lo contrario undefined
};

/**
 * Crea una nueva tarea en la base de datos.
 * @param {Object} taskData - Objeto con los datos de la tarea (title, description, status, user_id).
 * @returns {Promise<Object>} El objeto de la tarea creada con su nuevo ID.
 */
const createTask = async ({ title, description, status, user_id }) => {
    try {
        const [result] = await pool.query(
            'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)',
            [title, description, status, user_id]
        );
        // Devuelve la tarea con el ID generado por la base de datos
        return { id: result.insertId, title, description, status, user_id };
    } catch (error) {
        console.error('Error al crear la tarea en el modelo:', error.message);
        throw error;
    }
};

/**
 * Actualiza una tarea existente en la base de datos.
 * @param {number} taskId - El ID de la tarea a actualizar.
 * @param {Object} task - Objeto con los nuevos datos de la tarea (title, description, status).
 * @returns {Promise<Object>} El objeto de la tarea actualizada.
 */
const updateTask = async (taskId, task) => {
    const { title, description, status } = task;
    try {
        await pool.query(
            'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?',
            [title, description || null, status, taskId] // description puede ser null
        );
        // Devuelve el objeto de la tarea con los datos actualizados
        return { id: parseInt(taskId), title, description, status };
    } catch (error) {
        console.error('Error al actualizar la tarea en el modelo:', error.message);
        throw error;
    }
};

/**
 * Elimina una tarea de la base de datos.
 * @param {number} taskId - El ID de la tarea a eliminar.
 * @returns {Promise<void>}
 */
const deleteTask = async (taskId) => {
    try {
        await pool.query('DELETE FROM tasks WHERE id = ?', [taskId]);
    } catch (error) {
        console.error('Error al eliminar la tarea en el modelo:', error.message);
        throw error;
    }
};

module.exports = {
    getAllTasksByUserId,
    getTaskByIdAndUserId,
    createTask,
    updateTask,
    deleteTask,
};

