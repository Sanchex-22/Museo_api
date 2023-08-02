const db = require("../models");                 // Importa el archivo de modelos de la bd
const config = require("../config/auth.config"); // Importa la configuración de autenticación
const User = db.user;                            // Obtiene el modelo de usuario desde la bd
const Role = db.role;                            // Obtiene el modelo de rol desde la bd
const Persons = db.persons;                      //Obtiene el modelo de la información de la persona en la bd

const Op = db.Sequelize.Op;                      // Obtiene el operador Sequelize para realizar consultas

const jwt = require("jsonwebtoken");  // Importa el módulo 'jsonwebtoken' para generar tokens JWT
const bcrypt = require("bcryptjs");   // Importa el módulo 'bcryptjs' para el cifrado de contraseñas


/* -- Controlador para registrar un nuevo usuario -- */
exports.signup = async (req, res) => {
  /* -- Guarda el usuario en la base de datos --*/
  try {
    let { username, email, password, roles, name, last_name, identification, birth_date } = req.body; //inicializa todos los req

    /*-- Elimina los espacios en blanco que estén alrededor de estos datos --*/
    name = name.trim();
    last_name = last_name.trim();
    identification = identification.trim();
    /*-- Elimina los espacios en blanco que estén alrededor de estos datos --*/
    const user = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 8),  // Cifra la contraseña utilizando bcrypt
    });

    if (req.body.roles) {
      /* -- Si se proporcionan roles en la solicitud, busca los roles correspondientes en la base de datos -- */
      const foundRoles = await Role.findAll({
        where: {
          name: {
            [Op.or]: roles,
          },
        },
      });

      /* -- Asigna los roles al usuario -- */
      await user.setRoles(foundRoles);

    } else {
      /* -- Si no se proporcionan roles en la solicitud, asigna el rol de usuario por defecto (ID = 1) --*/
      await user.setRoles([1]);
    }

    /*-- Crear información personal asociada al usuario --*/

    const persons = await Persons.create({
      name,
      last_name,
      identification,
      birth_date,
    });
    /*-- Asocia la información personal al usuario --*/
    await user.setPerson(persons);

    res.status(201).send({ message: 'Usuario registrado con éxito!' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};


/* -- Controlador para iniciar sesión de un usuario -- */ 
exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign(
      { id: user.id },
      config.secret,
      {
        algorithm: 'HS256',
        allowInsecureKeySizes: true,
        expiresIn: 86400, // Caducidad del token: 24 horas
      }
    );

    let authorities = [];
    const roles = await user.getRoles();  // Obtiene los roles asociados al usuario
    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    req.session.token = token;  // Almacena el token en la sesión del usuario

    return res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      status: 'success',
      accessToken: token
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};


/* -- Controlador para cerrar sesión de un usuario -- */
exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({
      message: "You've been signed out!"
    });
  } catch (err) {
    this.next(err);
  }
};


/* -- Controlador para cerrar sesión de un usuario -- */
exports.forgotpassword = async (req,res)=>{
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    const hashedPassword = bcrypt.hashSync(req.body.newPassword,8);

    //Actualizar la contraseña del usuario con la nueva contraseña cifrada
    user.password = hashedPassword;
    await user.save();

    return res.status(200).send({
      message: "Contraseña restablecida con éxito",
    });
    
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
