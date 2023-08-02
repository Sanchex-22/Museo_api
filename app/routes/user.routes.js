/* -- Importa el middleware de autenticación JWT -- */
const { authJwt, verifySignUp } = require("../middleware");
const { verifyUserProfile } = require("../middleware");


/* -- Importa el controlador de usuarios -- */
const userController = require("../controllers/user.controller");


/* Exporta una función que toma la aplicación app como argumento. 
   Esta función será utilizada por otro archivo para configurar 
   las rutas y el middleware en la aplicación. 
*/
module.exports = function(app) {
  /* -- Middleware para agregar encabezados de control de acceso (CORS) a las respuestas HTTP -- */
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/user/profile",      // Ruta GET para acceder a la información de perfil de los usuarios
    [
      authJwt.verifyToken
    ],
    userController.getProfile
  );

  app.put(
    "/api/user/editProfile",  // Ruta GET para acceder a la edición de información del perfil de los usuarios
    [
      authJwt.verifyToken,
      verifyUserProfile.checkDuplicateUser,
      verifyUserProfile.verifyProfileUpdate,
      verifyUserProfile.checkDuplicateEmail
    ],
    userController.updateProfile
  );
  app.post(
    "/api/user/view",  // Ruta PUT para obtener la vista del usuario
    [
      authJwt.verifyToken,
    ],
    userController.toggleView
  );

  app.post(
    "/api/user/share",  // Ruta POST para obtener contabilizar los compartidos
    [
      authJwt.verifyToken,
    ],
    userController.toggleShare
  );

  app.post('/api/user/like',             //Ruta POST para brindar un like
    [
      authJwt.verifyToken
    ],
    userController.toggleLike

);
  
app.get('/api/user/like/:exhibitID',             //Ruta POST para traer like
    [
      authJwt.verifyToken
    ],
    userController.getLikeStatus

);

  app.get(
    "/api/test/all",          // Ruta GET para acceder a recursos de prueba para todos los usuarios
    userController.allAccess  
  );  
  
  app.get(  
    "/api/test/user",         // Ruta GET para acceder a recursos de prueba solo para usuarios autenticados
    [authJwt.verifyToken],    // Middleware para verificar el token de autenticación JWT
    userController.userBoard  
  );  

  app.get(
    "/api/test/mod",          // Ruta GET para acceder a recursos de prueba solo para moderadores autenticados
    [                         // Middleware para verificar el token de autenticación JWT y el rol de moderador
      authJwt.verifyToken, 
      authJwt.isModerator
    ],
    userController.moderatorBoard
  );

  app.get( 
    "/api/test/admin",        // Ruta GET para acceder a recursos de prueba solo para administradores autenticados
    [                         // Middleware para verificar el token de autenticación JWT y el rol de administrador
      authJwt.verifyToken,  
      authJwt.isAdmin
    ],
    userController.adminBoard
  );

/*-- CONTROLADOR DE GERENTE--*/
  app.get( 
    "/api/gerente/board",        // Ruta GET para acceder a recursos de prueba solo para administradores autenticados
    [                         // Middleware para verificar el token de autenticación JWT y el rol de administrador
      authJwt.verifyToken,  
    ],
    userController.getUserCrudGerent
  );


  /*-- Controlador para traer las métricas --*/
  app.get( 
    "/api/gerente/board/:personID",        // Ruta GET para acceder a recursos de prueba solo para administradores autenticados
    [                         // Middleware para verificar el token de autenticación JWT y el rol de administrador
      authJwt.verifyToken,  
    ],
    userController.getMetricsByPersonID
  );
  /*-- CONTROLADOR DE GERENTE--*/


  app.put(
    "/api/user/changepassword",  //Ruta PUT para cambiar contraseña
    [
      authJwt.verifyToken,
      verifyUserProfile.validateNewPassword,
      verifyUserProfile.checkChangePassword
    ],
    userController.changePass   //Controlador para cambiar contraseña
  );

};