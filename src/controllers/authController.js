const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const login = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await userModel.getUserByEmail(email);
        if(!user){
            return res.status(400).json({message: 'Credenciales invalidas'});
        }
    
    
    const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET);
    res.json({token});
 }catch(error){
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({message: 'Error al iniciar sesión'});
 }
};
module.exports = {
    login
};
