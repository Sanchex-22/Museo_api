/* -- Importa el archivo de modelos de la base de datos -- */
const db = require("../models");

/* -- Obtiene los roles definidos en la base de datos -- */
const ROLES = db.ROLES;

/* -- Obtiene el modelo de usuario desde la base de datos -- */
const User = db.user;

/*-- Obtiene el modelo de información del usuario desde la base de datos --*/
const Persons = db.persons;


/* -- Middleware para verificar si el nombre de usuario o correo electrónico ya están en uso -- */
checkDuplicateUsernameOrEmail = async (req, res, next) => {
  try {
    // Verificar nombre de usuario
    let user = await User.findOne({
      where: {
        username: req.body.username
      }
    });

    if (user) {
      return res.status(400).send({
        message: "Failed! Username is already in use!"
      });
    }

    // Verificar correo electrónico
    user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (user) {
      return res.status(400).send({
        message: "Failed! Email is already in use!"
      });
    }

    next();
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};


/* -- Middleware para verificar si los roles existen -- */
checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  }
  next();
};

/*-- Middleware para verificar que el usuario entre su nombre --*/
checkName = (req, res, next) => {
  const nombre = req.body.name;
  if(!nombre){  //Se asegura de que el usuario esté entrando un nombre
    return res.status(400).send({
      message: "Fallo! Por favor escribe un nombre"
    });
  }
  if(/\d/.test(nombre)) { //Se asegura de que ese nombre no posea números
    return res.status(400).send({
      message: "Fallo! El nombre no puede contener números"
    });
  }
  if (/[^\w\s]/.test(nombre)){//Se asegura de que el campo nombre no posea caracteres espaciales
    return res.status(400).send({
      message: "Fallo! El nombre no puede contener caracteres especiales"
    });
  }
  next();
};

/*-- Middleware para verificar que el usuario entre su apellido --*/
checkLastName = (req, res, next) => {
  const apellido = req.body.last_name;
  if(!apellido){ //Se asegura de que el usuario esté entrando un apellido
    return res.status(400).send({ 
      message: "Fallo! Por favor escribe un apellido"
    });
  }

  if(/\d/.test(apellido)){ //Se asegura de que ese apellido no posea números
    return res.status(400).send({ 
      message: "Fallo! El apellido no puede contener números"
    });
  }
  if (/[^\w\s]/.test(apellido)){//Se asegura de que el campo apellido no posea caracteres espaciales
    return res.status(400).send({
      message: "Fallo! El apellido no puede contener caracteres especiales"
    });
  }
  next();
};

/*-- Middleware para verificar que el usuario entre una fecha de nacimiento --*/
checkBirthDate = (req, res, next) =>{
  const birth = req.body.birth_date;
  if(!birth){
    return res.status(400).send({ //Manda mensaje de error 
      message: "Fallo! El usuario debe agregar fecha de nacimiento"
    });
  }
  next();
};

/*-- Middleware para verificar que el usuario entre su cédula --*/
checkIdentification = (req, res, next) => {
  let identification = req.body.identification;
  if(!identification){
    return res.status(400).send({
      message: "Fallo! El usuario debe tener una cédula"
    });
  }

  //Eliminar el espacio al rededor 
  identification = identification.trim();
  if(/\s/.test(identification)) {
    return res.status(400).send ({ message: "La cédula no puede tener lugares en blanco" });
  }
  next();
};

/*-- Middleware para verificar que la contraseña sea más larga que 8 caracteres --*/
validatePassword = (req, res, next) => {
  try {
    const { password } = req.body;

    if(!password){
      return res.status(400).send({message: "Debe poseer una contraseña" });
    }
    // Verificar la longitud de la contraseña
    if(password.length<8){
      return res.status(400).send ({ message: "La contraseña debe tener 8 o más caracteres" });
    }

    // Verificar si la contraseña contiene espacios en blanco
    if(/\s/.test(password)) {
      return res.status(400).send ({ message: "La contraseña no puede tener espacios en blanco" });
    }

    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

/*-- Middleware para verificar que el usuario no nos entre un campo en blanco en username --*/
validateUsernameAndEmail = (req, res, next) => {
  try {
    let { username, email } = req.body;

     // Verificar que el email no esté vacío
     if (!email) {
      return res.status(400).send({ message: "Debes proporcionar un correo" });
    }

    // Verificar que el usuario no esté vacío
    if (!username) {
      return res.status(400).send({ message: "Debes proporcionar un nombre de usuario" });
    }

    // Verificar que el username no tenga espacios en blanco
    if(/\s/.test(username)) {
      return res.status(400).send ({ message: "El usuario no puede tener espacios en blanco" });
    }
    // Verificar que el correo no tenga espacios en blanco
    if(/\s/.test(email)) {
      return res.status(400).send ({ message: "El correo no puede tener espacios en blanco" });
    }

    // Verificar que el usuario sea mayor a 6 caracteres
    if (username.length <= 6) {
      return res.status(400).send({ message: "El nombre de usuario debe tener más de 6 caracteres" });
    }

    // Verificar que el correo sea un formato válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).send({ message: "Debes proporcionar un correo válido" });
    }

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


/* -- Objeto que contiene los middlewares de verificación de registro -- */
const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
  checkName,
  checkLastName,
  checkBirthDate,
  checkIdentification,
  validatePassword,
  validateUsernameAndEmail
};


/* -- Exporta el objeto verifySignUp como un módulo -- */
module.exports = verifySignUp;

