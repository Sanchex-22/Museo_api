/* -- Importa el middleware de autenticación JWT  -- */
const authJwt = require("./authJwt");

/* -- Importa el middleware de verificación de registro -- */
const verifySignUp = require("./verifySignUp");

/* -- Importa el middleware de verificación de registro -- */
const verifyCreateExhibit = require("./verifyCreateExhibit");

/* -- Importa el middleware de verificación de registro -- */
const verifyForgotPass = require("./verifyForgotPass");
const verifyUserProfile = require("./verifyUserProfile");



module.exports = {
  authJwt,              // Exporta el middleware de autenticación JWT
  verifySignUp,         // Exporta el middleware de verificación de registro
  verifyCreateExhibit,  //Exporta el middleware para verificación de campos de registro de exhibición
  verifyForgotPass,     //Exporta el middleware para verificación de campos de olvidó contraseña
  verifyUserProfile     //Exporta el middleware para la verificación de cambios de campos en el perfil
};

