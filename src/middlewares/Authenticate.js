const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).json({ message: 'Token no proporcionado o formato incorrecto' });
    }
    const token = authHeader.split(' ')[1];

    try {
        const decoded =jwt.verify(token, JWT_SECRET);
        req.user = decoded; //traduzca el token decodificado al objeto de usuario
        next(); //continua con la siguiente funcion middleware o ruta
    }catch (error) {
        console.log('Error en la autenticación:', error);
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};
module.exports = authenticate;