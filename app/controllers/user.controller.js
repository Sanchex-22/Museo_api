const db = require("../models");
const User = db.user;
const Persons = db.persons;
const ExhibitsPersonsMetrics = db.exhibitsPersonsMetrics; //Obtiene el modelo de las métricas desde la bd
const ExhibitsStats = db.exhibits_stats;                  //Obtiene el modelo de las estadísticas desde la bd
const Exhibit = db.exhibits;                              // Obtiene el modelo de exhibit desde la bd
const bcrypt = require ('bcryptjs');                      // Importa el módulo para el cifrado de la contraseña wiiii

/*para obtener perfil*/
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId, {
      include: {
        model: Persons,
        attributes: ['name', 'last_name', 'identification', 'birth_date', 'profile_picture']
      },
    });

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    const roles = await user.getRoles();

    const userProfile = {
      username: user.username,
      email: user.email,
      roles: roles.map((role) => role.name),
      ...user.person.dataValues 
    };

    res.status(200).send(userProfile);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/*-- Controlador para actualizar los datos del perfil --*/
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    let fieldsToUpdate = req.body; // Los campos a actualizar se envían en el cuerpo de la solicitud

    const user = await User.findByPk(userId, {
      include: {
        model: Persons,
      },
    });

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    // Omitir la actualización del campo "username" si no se proporciona en la solicitud
    if (!fieldsToUpdate.hasOwnProperty('username')) {
      delete fieldsToUpdate.username;
    }

    // Omitir la actualización del campo "password" si se proporciona en la solicitud
    if (fieldsToUpdate.hasOwnProperty('password')) {
      delete fieldsToUpdate.password;
    }

    // Eliminar los espacios en blanco alrededor de los valores de name, lastname, birth_date, profile_picture y email.
    if (fieldsToUpdate.hasOwnProperty('name')) {
      fieldsToUpdate.name = fieldsToUpdate.name.trim();
    }
    if (fieldsToUpdate.hasOwnProperty('last_name')) {
      fieldsToUpdate.lastname = fieldsToUpdate.last_name.trim();
    }
    if (fieldsToUpdate.hasOwnProperty('birth_date')) {
      fieldsToUpdate.birth_date = fieldsToUpdate.birth_date.trim();
    }
    if (fieldsToUpdate.hasOwnProperty('profile_picture')) {
      fieldsToUpdate.profile_picture = fieldsToUpdate.profile_picture.trim();
    }
    if (fieldsToUpdate.hasOwnProperty('email')) {
      fieldsToUpdate.email = fieldsToUpdate.email.trim();
    }
    
    
    
    // Actualizar los campos enviados en la solicitud en el modelo User
    await user.update(fieldsToUpdate);

    // Actualizar los campos enviados en la solicitud en el modelo Persons
    if (user.person) {
      await user.person.update(fieldsToUpdate);
    }

    res.status(200).send({ message: "Perfil actualizado exitosamente" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
// Controlador para dar like o quitar el like a una exhibición
exports.toggleLike = async (req, res) => {
  const { exhibitID } = req.body;
  const personID = req.userId;

  try {
    let existingLike = await ExhibitsPersonsMetrics.findOne({ where: { exhibitID, personID } });

    let liked = false;

    if (existingLike) {
      existingLike.likes = existingLike.likes === 0 ? 1 : 0;
      await existingLike.save();
      liked = existingLike.likes === 1;
    } else {
      existingLike = await ExhibitsPersonsMetrics.create({ exhibitID, personID, likes: 1 });
      liked = true;
    }

    // Actualiza el total de likes en exhibits_stats
    let exhibitStats = await ExhibitsStats.findOne({ where: { exhibitId: exhibitID } });

    if (exhibitStats) {
      exhibitStats.totalLikes += liked ? 1 : -1;
      await exhibitStats.save();
    } else {
      exhibitStats = await ExhibitsStats.create({ exhibitId: exhibitID, totalLikes: 1 });
    }

    return res.status(200).send({ message: 'Operación exitosa', liked });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

//Controlador para hacer un share
exports.toggleShare = async (req, res) => {
  try {
    const { exhibitID } = req.body;
    const personID = req.userId;
    // Buscar registro existente en ExhibistPersonsMetrics para la persona y el exhibición
    let existingMetrics = await ExhibitsPersonsMetrics.findOne({
      where: {exhibitID, personID},
    });

    if (existingMetrics) {
      // Si existe, incrementar shares en 1 
      existingMetrics.shares += 1;
      await existingMetrics.save();
    } else {
      // Si no existe, crear un nuevo registro con shares en 1
      await ExhibitsPersonsMetrics.create({exhibitID,personID,shares:1});
    }

    // Actualizar el total de shares en exhibits_stats
    let exhibitStats = await ExhibitsStats.findOne({ where: {exhibitId: exhibitID}});

    if(exhibitStats) {
      exhibitStats.totalShares +=1;
      await exhibitStats.save();
    }else{
      exhibitStats = await ExhibitsStats.create({exhibitId: exhibitID, totalShares:1});
    }

    return res.status(200).send({ message: 'Operación exitosa', shared: true});
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
};

// Controlador para mapear un like de una exhibición
exports.getLikeStatus = async (req, res) => {
  const { exhibitID } = req.params;
  const personID = req.userId;

  try {
    const likeInfo = await ExhibitsPersonsMetrics.findOne({
      where: { exhibitID, personID },
      attributes: ['likes'], // Solo obtener el campo 'likes'
    });

    const hasLiked = likeInfo ? likeInfo.likes === 1 : false; // Verificar si el usuario ha dado like

    return res.status(200).send({ hasLiked });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};


// Controlador para gestionar las vistas de una exhibición
exports.toggleView = async (req, res) => {
  const { exhibitID } = req.body;
  const personID = req.userId;

  try {
    const existingView = await ExhibitsPersonsMetrics.findOne({
      where: { exhibitID, personID }
    });

    if (existingView) {
      // El usuario ya ha visto la exhibición, no se realiza ninguna acción adicional
      return res.status(200).send({ message: 'Operación exitosa', viewed: true });
    }

    await ExhibitsPersonsMetrics.create({ exhibitID, personID, visits: 1 });

    const exhibitStats = await ExhibitsStats.findOne({ where: { exhibitId: exhibitID } });

    if (exhibitStats) {
      exhibitStats.totalViews += 1;
      await exhibitStats.save();
    } else {
      await ExhibitsStats.create({ exhibitId: exhibitID, totalViews: 1 });
    }

    return res.status(200).send({ message: 'Operación exitosa', viewed: true });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};


/*-- Controlador de gerente que hace get de la lista--*/

exports.getUserCrudGerent = async (req, res) => {
  try {
    const allUsers = await User.findAll({
      attributes: ['id','username'],
      include: [
        {
          model: Persons,
          attributes: ['profile_picture']
        }
      ]
       
    });

    const users = allUsers.map(user =>({
      id: user.id,
      username: user.username,
      profile_picture: user.person.profile_picture
    }));

    return res.status(200).send({users});
  } catch (error) {
    return res.status(500).send({message: error.message});
  }
};

// Controlador para obtener las métricas de una persona por su ID
exports.getMetricsByPersonID = async (req, res) => {
  try {
    const personID = req.params.personID;

    const metrics = await Persons.findAll({
      where: { personID },
      include: [
        {
          model: Exhibit,
          attributes: ['exhibitID', 'title'],
          through: {
            model: ExhibitsPersonsMetrics,
            attributes: ['likes', 'shares']
          }
        }
      ],
      attributes: ['personID'],
      through: { attributes: [] } // Excluimos los atributos de la tabla intermedia
    });

    return res.status(200).send({ metrics });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Controlador para cambiar contraseña de una persona por su ID
exports.changePass = async (req, res) => {
  try {
    const userId = req.userId;
    //Buscar el usuario con la cock
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    const hashedPassword = bcrypt.hashSync(req.body.newPassword, 8);

    //Actualizar la contraseña del usuario con la nueva contraseña cifrada

    user.password = hashedPassword;
    await user.save();

    return res.status(200).send({
      message: "Contraseña restablecida con éxito",
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
