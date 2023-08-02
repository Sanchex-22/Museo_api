/*-- Importa el archivo de modelos de la base de datos --*/
const db = require("../models");

/*-- Obtiene el modelo de usuario desde la base de datos --*/

const User = db.user;

/*-- Middleware para verificar si el nombre de usuario a recuperar contraseña está registrado en la base de datos --*/

checkUsername = async (req, res, next) =>{
    try {
        let user = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        if(!user) {
            return res.status(400).send({
                message: "Este nombre de usuario no existe."
            });
        }

        next();
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};

/*-- Objeto que contiene los middlewares de recuperar contraseña  --*/

const verifyForgotPass = {
    checkUsername
};

module.exports = verifyForgotPass;