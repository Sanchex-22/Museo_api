/* -- Importa el módulo "express", "cors" y "cookie-session"  -- */
require('dotenv').config({path: './.env'});
const express = require("express"); 
const cors = require("cors");
const cookieSession = require("cookie-session");


/* -- Crea una instancia de la aplicación Express -- */
const app = express();


/* -- Usa el middleware "cors" en la aplicación -- */
//Configurar CORS con opciones
// const corsOptions = {
//   origin: 'http://192.168.0.10:19000', // Reemplaza con la URL de tu aplicación React Native
//   optionsSuccessStatus: 200, // Algunos navegadores requieren que se establezca explícitamente el código de estado 200 para las solicitudes CORS preflight
// };
app.use(cors());


/* -- Parsea las solicitudes con el tipo de contenido - application/json -- */
app.use(express.json());


/* -- Parsea las solicitudes con el tipo de contenido - application/x-www-form-urlencoded -- */
app.use(express.urlencoded({ extended: true }));


/* -- Configura el middleware "cookie-session" en la aplicación -- */
app.use(
  cookieSession({
    name: "museum-session",   // Nombre de la sesión de la cookie
    keys: [process.env.COOKIE_SECRET],  // Claves de cifrado para la cookie (se debería usar una variable de entorno para esto)
    httpOnly: true,           // La cookie solo es accesible a través del protocolo HTTP
    sameSite: 'strict'        // Configura la política de SameSite para la cookie
  })
);

/* -- Base de datos -- */
const db = require("./app/models");  // Importa el archivo de modelos de la base de datos
const Role = db.role;                // Obtiene el modelo de Roles de la base de datos

db.sequelize.sync(); // Sincroniza la base de datos


/* -- Ruta simple -- */
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the museum api" });
});


/* -- Rutas -- */
require("./app/routes/auth.routes")(app);  // Importa y configura las rutas de autenticación en la aplicación
require("./app/routes/user.routes")(app);  // Importa y configura las rutas de usuario en la aplicación
require("./app/routes/exhibit.routes")(app);// Importa y configura las rutas de las exhibiciones en la aplicación

/* -- Configura el puerto y escucha las solicitudes entrantes -- */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


/* -- Crea roles iniciales en la base de datos -- */
function initial() {
  Role.create({
    id: 1,
    name: "user",
  });

  Role.create({
    id: 2,
    name: "moderator",
  });

  Role.create({
    id: 3,
    name: "admin",
  });
}