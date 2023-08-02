/* -- Importa el módulo 'jsonwebtoken' para manejar tokens JWT -- */
const jwt = require("jsonwebtoken");

/* -- Importa la configuración de autenticación -- */
const config = require("../config/auth.config.js");

/* -- Importa el archivo de modelos de la base de datos -- */
const db = require("../models");

 /* -- Obtiene el modelo de usuario desde la base de datos -- */
const User = db.user;



/* -- Middleware para verificar el token de autenticación -- */
verifyToken = (req, res, next) => {
  let token = req.session.token; // Obtiene el token de la sesión

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(
    token, 
    config.secret, 
    (err, decoded) => {
      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      req.userId = decoded.id; // Almacena el ID de usuario decodificado en la solicitud
      next();
    }
  );
};



/* -- Middleware para verificar si el usuario es un administrador -- */
isAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId); // Busca el usuario por su ID
    const roles = await user.getRoles();          // Obtiene los roles asociados al usuario

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {            // Si el usuario tiene el rol de administrador, permite el acceso
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Admin Role!",
    });

  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate User role!",
    });
  }
};


/* -- Middleware para verificar si el usuario es un moderador -- */
isModerator = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Moderator Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Moderator role!",
    });
  }
};


/* -- Middleware para verificar si el usuario es un moderador o Admin-- */
isModeratorOrAdmin = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        return next();
      }

      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require Moderator or Admin Role!",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate Moderator or Admin role!",
    });
  }
};


/* -- Objeto que contiene los middlewares relacionados con la autenticación y autorización JWT -- */
const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin
};


/* -- Exporta el objeto authJwt como un módulo -- */
module.exports = authJwt;
