/* -- Importa el archivo de modelos de la base de datos -- */
const db = require("../models");

/* -- Obtiene el modelo de usuario desde la base de datos -- */
const User = db.user;

const bcrypt = require("bcryptjs"); // Importa el módulo para el cifrado de la contraseña wiiii

checkDuplicateUser = async (req, res, next) => {
  const { username } = req.body;

  if (!username) {
    return next();
  }

  try {
    const user = await User.findOne({
      where: {
        username: username,
      },
    });

    if (user) {
      return res
        .status(400)
        .send({ message: "El nombre de usuario ya está en uso" });
    }

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

checkDuplicateEmail = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next();
  }

  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      return res.status(400).send({ message: "El correo ya está en uso" });
    }

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

verifyProfileUpdate = (req, res, next) => {
  try {
    const {
      username,
      name,
      last_name,
      birth_date,
      profile_picture,
      password,
      email,
    } = req.body;

    // Verificar si todos los campos están vacíos
    const areAllFieldsEmpty =
      !username &&
      !name &&
      !last_name &&
      !birth_date &&
      !profile_picture &&
      !email;
    if (areAllFieldsEmpty) {
      return res
        .status(400)
        .send({
          message: "Debes proporcionar al menos un campo para actualizar",
        });
    }

    // Verificar que los campos no estén vacíos
    const fieldMessages = [];

    // Verificando que el username cumpla todo lo que debería cumplir para entrar a nuestra base de datos
    if (username !== undefined) {
      if (username.trim() === "") {
        fieldMessages.push("El campo 'usuario' no puede estar vacío");
      } else if (/\s/.test(username)) {
        fieldMessages.push(
          "El campo usuario no puede llevar espacios en blanco"
        );
      } else if (username.length <= 6) {
        fieldMessages.push(
          "El nombre de usuario debe tener más de 6 caracteres"
        );
      }
    }
    // Verificando que el name cumpla todo lo que debería cumplir para entrar a nuestra base de datos
    if (name !== undefined) {
      if (name.trim() === "") {
        fieldMessages.push("El campo 'nombre' no puede estar vacío");
      } else if (/\s/.test(name)) {
        fieldMessages.push(
          "El campo 'nombre' no puede llevar espacios en blanco"
        );
      } else if (/\d/.test(name)) {
        fieldMessages.push("El campo 'nombre' no pueda llevar números");
      } else if (/[^\w\s]/.test(name)) {
        fieldMessages.push(
          "El campo 'nombre' no puede llevar caracteres especiales"
        );
      }
    }
    // Verificando que el last_name cumpla todo lo que debería cumplir para entrar a nuestra base de datos
    if (last_name !== undefined) {
      if (last_name.trim() === "") {
        fieldMessages.push("El campo 'apellido' no puede estar vacío");
      } else if (/\s/.test(last_name)) {
        fieldMessages.push(
          "El campo 'apellido' no puede llevar espacios en blanco"
        );
      } else if (/\d/.test(last_name)) {
        fieldMessages.push("El campo 'apellido' no pueda llevar números");
      } else if (/[^\w\s]/.test(last_name)) {
        fieldMessages.push(
          "El campo 'nombre' no puede llevar caracteres especiales"
        );
      }
    }
    // Verificando que el birth_date cumpla todo lo que debería cumplir para entrar a nuestra base de datos
    if (birth_date !== undefined) {
      if (birth_date.trim() === "") {
        fieldMessages.push(
          "El campo 'fecha de nacimiento' no puede estar vacío"
        );
      } else if (/\s/.test(birth_date)) {
        fieldMessages.push(
          "El campo 'fecha de nacimiento' no puede llevar espacios en blanco"
        );
      }
    }
    // Verificando que el profile_picture cumpla todo lo que debería cumplir para entrar a nuestra base de datos
    if (profile_picture !== undefined) {
      if (profile_picture.trim() === "") {
        fieldMessages.push("El campo 'foto de perfil' no puede estar vacío");
      } else if (/\s/.test(profile_picture)) {
        fieldMessages.push(
          "El campo 'foto de perfil' no puede llevar espacios en blanco"
        );
      }
    }
    // Verificando que el email cumpla todo lo que debería cumplir para entrar a nuestra base de datos
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email !== undefined) {
      if (email.trim() === "") {
        fieldMessages.push("El campo 'correo' no puede estar vacío");
      } else if (/\s/.test(email)) {
        fieldMessages.push(
          "El campo 'correo' no puede llevar espacios en blanco"
        );
      } else if (!emailRegex.test(email)) {
        fieldMessages.push("Debes proporcionar un correo válido");
      }
    }

    if (fieldMessages.length > 0) {
      return res.status(400).send({ message: fieldMessages });
    }

    if (req.body.identification) {
      return res.status(400).send({ message: "No puede actualizar su cédula" });
    }

    // Verificar si se incluye el campo "password" y devolver un mensaje de error
    if (password !== undefined) {
      return res
        .status(400)
        .send({
          message:
            "Por motivos de seguridad no puedes actualizar la contraseña desde aquí!, pide un token de recuperación",
        });
    }

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
checkChangePassword = async (req, res, next) => {
  try {
    const userId = req.userId;
    const oldPassword = req.body.oldPassword;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .send({ message: "La contraseña anterior no es correcta" });
    }

    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/*-- Middleware para verificar que la contraseña sea más larga que 8 caracteres --*/
validateNewPassword = (req, res, next) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).send({ message: "Escriba su contraseña" });
    }
    //Verificar la longitud de la contraseña
    if (newPassword.length < 8) {
      return res
        .status(400)
        .send({ message: "La contraseña debe tener 8 o más caracteres" });
    }
    //Verificar si la contraseña tiene espacios en blanco
    if (/\s/.test(newPassword)) {
      return res
        .status(400)
        .send({ message: "La contraseña no puede tener espacios en blanco" });
    }

    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

const verifyUserProfile = {
  checkDuplicateUser,
  checkDuplicateEmail,
  verifyProfileUpdate,
  checkChangePassword,
  validateNewPassword,
};

module.exports = verifyUserProfile;
