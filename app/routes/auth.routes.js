/* -- Importa el middleware para verificar la inscripción -- */
const { verifySignUp } = require("../middleware");

/* -- Improtar el middleware para verificar si el usuario a cambiar contraseña existe -- */
const { verifyForgotPass } = require("../middleware");
/* -- Importa el controlador de autenticación  --*/
const authController = require("../controllers/auth.controller");


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

  app.post(
    "/api/auth/signup",  // Ruta POST para el registro de usuarios
    [
      verifySignUp.validateUsernameAndEmail,      // Middleware para verificar que el correo tenga un formato exacto y el username un tamaño correcto
      verifySignUp.checkDuplicateUsernameOrEmail, // Middleware para verificar que el nombre de usuario o correo electrónico no estén duplicados
      verifySignUp.checkRolesExisted,             // Middleware para verificar que los roles especificados existan
      verifySignUp.validatePassword,              // Middleware para verificar que la contraseña es más larga que 8
      verifySignUp.checkName,                     // Middleware para verificar que el usuario entre un nombre
      verifySignUp.checkLastName,                 // Middleware para verificar que el usuario entre un apellido
      verifySignUp.checkBirthDate,                // Middleware para verificar que el usuario entre fecha de nacimiento
      verifySignUp.checkIdentification            // Middleware para verificar que el usuario entre cédula
    ],
    authController.signup    // Controlador para el registro de usuarios
  );

  app.post(
    "/api/auth/signin",   // Ruta POST para el inicio de sesión de usuarios
    authController.signin     // Controlador para el inicio de sesión de usuarios
  );  
 
  app.post( 
    "/api/auth/signout",  // Ruta POST para el cierre de sesión de usuarios
    authController.signout    // Controlador para el cierre de sesión de usuarios
  );
  
  app.put(
    "/api/auth/forgotpassword",  //Ruta PUT para cambiar contraseña
    [
      verifyForgotPass.checkUsername,
      verifySignUp.validatePassword
    ],
    authController.forgotpassword    //Controlador para cambiar contraseña
  );
};