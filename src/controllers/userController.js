const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

//Creacion de usuario
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  //Validacion 
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Todas las secciones son requeridas" });
  }
  try {
    //Incriptacion de la informacion
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.createUser({
      username,
      email,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ message: "Creacion de usuario con éxito", user: newUser });
  } catch (error) {
    console.error(error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        error:
          "Este correo ya existe, por favor intenta uno distinto",
      });
    }
    res
      .status(500)
      .json({ error: "Sucedio un error al crear el usuario" });
  }
};

module.exports = {
  registerUser,
};