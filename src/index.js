const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- INICIO DE LA MODIFICACIÓN PARA RENDER ---

// 1. Configuración de CORS para producción y desarrollo
// Render configurará FRONTEND_URL con la dirección de tu app en Vercel.
// Para desarrollo local, seguirá usando localhost.
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

// Middlewares
app.use(cors(corsOptions));

// --- FIN DE LA MODIFICACIÓN ---

app.use(express.json());

// Rutas (sin cambios)
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

app.get('/api/ping', (req, res) => {
    res.status(200).send('pong');
});

// Inicio del servidor (ya estaba correcto para Render)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
