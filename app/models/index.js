/* -- Importa la configuración de la base de datos desde el archivo db.config.js --*/
const config = require("../config/db.config.js");


/* -- Importa la biblioteca Sequelize para la administración de la base de datos -- */
const Sequelize = require("sequelize");


/* -- Crea una instancia de Sequelize para establecer la conexión a la base de datos -- */
const sequelize = new Sequelize(
  config.DB,         // Nombre de la base de datos obtenido de la configuración
  config.USER,       // Nombre de usuario de la base de datos obtenido de la configuración
  config.PASSWORD,   // Contraseña de la base de datos obtenida de la configuración
  {
    host: config.HOST,                 // Host de la base de datos obtenido de la configuración
    dialect: config.dialect,           // Dialecto de la base de datos obtenido de la configuración
    pool: {                            // * Configuración del grupo de conexiones de la base de datos
      max: config.pool.max,            // Número máximo de conexiones en el grupo
      min: config.pool.min,            // Número mínimo de conexiones en el grupo
      acquire: config.pool.acquire,    // Tiempo máximo de adquisición de una conexión en milisegundos
      idle: config.pool.idle           // Tiempo máximo de inactividad de una conexión en milisegundos
    }
  }
);



/* -- Objeto para almacenar los modelos y otras configuraciones de la base de datos --*/
const db = {};
db.Sequelize = Sequelize;   // Asigna el objeto Sequelize al objeto db
db.sequelize = sequelize;   // Asigna la instancia de Sequelize (conexión a la base de datos) al objeto db



/* -- Importa el modelo de usuario y lo asocia con la conexión a la base de datos -- */
db.user = require("../models/user.model.js")(sequelize, Sequelize);
/* -- Importa el modelo de rol y lo asocia con la conexión a la base de datos -- */
db.role = require("../models/role.model.js")(sequelize, Sequelize);
/* -- Importa el modelo de datos de los usuarios y lo asocia con la conexión a la base de datos -- */
db.persons = require ("../models/persons.model.js")(sequelize, Sequelize);
/*-- Importa el modelo de los datos de exhibits y lo asocia con la conexión a la base de datos --*/
db.exhibits = require("../models/exhibits.model.js")(sequelize, Sequelize);
/*-- Importa el modelo de las métricas de persons-exhibits --*/
db.exhibitsPersonsMetrics = require("../models/exhibits_persons_metrics.model.js")(sequelize, Sequelize);
/*-- Importa el modelo de los datos de categories --*/
db.categories = require("../models/categories.model.js")(sequelize, Sequelize);
/*-- Importa el modelo de los datos de exhibits_stats --*/
db.exhibits_stats = require("../models/exhibits_stats.model.js")(sequelize, Sequelize);
/*-- Importa el modelo de los datos de exhibits_images --*/
db.exhibits_images = require("../models/exhibits_images.model.js")(sequelize, Sequelize);
/*-- Importa el modelo de los datos de exhibits_qr --*/
db.exhibits_qr = require("../models/exhibits_qr.model.js")(sequelize, Sequelize);
/*-- Importa el modelo de la tabla exhibits_videos --*/
db.exhibits_videos = require("../models/exhibits_videos.model.js")(sequelize, Sequelize);
/*-- Importa el modelo de la tabla exhibits_conversation --*/
db.exhibits_conversation = require("../models/exhibits_conversation.model.js")(sequelize, Sequelize);
/*-- Importa el modelo de la tabla exhibits_conversation_audios--*/
db.exhibits_conversation_audios = require("../models/exhibits_conversation_audios.model.js")(sequelize, Sequelize);
/*-- Importa el modelo de la tabla exhibits_gif --*/
db.exhibits_gif = require("../models/exhibits_gif.model.js")(sequelize, Sequelize);
/*-- Importa el modelo de la tabla exhibits_text--*/
db.exhibits_text = require("../models/exhibits_text.model.js")(sequelize, Sequelize);



/* -- Establece una relación de muchos a muchos entre los roles y los usuarios -- */
db.role.belongsToMany(db.user, {
  through: "user_roles"   // Utiliza la tabla "user_roles" como tabla intermedia para la relación
});
/* -- Establece una relación de muchos a muchos entre los usuarios y los roles -- */
db.user.belongsToMany(db.role, {
  through: "user_roles"   // Utiliza la tabla "user_roles" como tabla intermedia para la relación
});

/* -- Establece la relación uno a uno entre user y persons -- */
db.user.hasOne(db.persons, {
  foreignKey: 'userID',
  onDelete: 'CASCADE'
});
db.persons.belongsTo(db.user,{
  foreignKey: 'userID',
  onDelete: 'CASCADE'
});

/*-- Estable la relación de 1 a muchos entre categories y exhibits --*/
db.exhibits.belongsTo(db.categories, 
  {foreignKey: "categoryID"
});
db.categories.hasMany(db.exhibits, 
  {foreignKey: "categoryID"
});

/*-- Establece la relación de muchos a muchos entre exhibits y persons --*/
db.exhibits.belongsToMany(db.persons,{
  through: db.exhibitsPersonsMetrics, foreignKey: "exhibitID"
});
db.persons.belongsToMany(db.exhibits,{
  through: db.exhibitsPersonsMetrics, foreignKey: "personID"
});

/*-- Establece la relación uno a uno exhibits y exhibits_stats --*/
db.exhibits.hasOne(db.exhibits_stats, {
  foreignKey: 'exhibitId'
});

db.exhibits_stats.belongsTo(db.exhibits, {
  foreignKey: 'exhibitId'
});

/*-- Establece la relación de uno a muchos entre exhibits y exhibits_images con eliminación en cascada--*/
db.exhibits.hasMany(db.exhibits_images, {
  foreignKey: 'exhibitID',
  onDelete: 'CASCADE' // Configuración de eliminación en cascada
});
db.exhibits_images.belongsTo(db.exhibits, {
  foreignKey: 'exhibitID',
  onDelete: 'CASCADE' // Configuración de eliminación en cascada
});

/*-- Establece la relación de uno a uno entre exhibits y exhibits_qr con eliminación en cascada--*/
db.exhibits.hasOne(db.exhibits_qr, {
  foreignKey: 'exhibitID',
  onDelete: 'CASCADE' // Configuración de eliminación en cascada
});
db.exhibits_qr.belongsTo(db.exhibits, {
  foreignKey: 'exhibitID',
  onDelete: 'CASCADE' // Configuración de eliminación en cascadda
});

/*-- Establece la relación de uno a uno entre exhibits y exhibits_videos --*/
db.exhibits.hasOne(db.exhibits_videos, {
  foreignKey: 'exhibitID',
  onDelete: 'CASCADE' // Configuración de eliminación en cascada 
});
db.exhibits_videos.belongsTo(db.exhibits, {
  foreignKey: 'exhibitID',
  onDelete: 'CASCADE' // Configuración de eliminación en cascada
});

/*-- Establece la relación de uno a uno entre exhibits y exhibits_conversation --*/
db.exhibits.hasOne(db.exhibits_conversation, {
  foreignKey: 'exhibitID',
  onDelete: 'CASCADE' // Configuración de eliminación en cascada
});
db.exhibits_conversation.belongsTo(db.exhibits, {
  foreignKey: 'exhibitID',
  onDelete: 'CASCADE' // Configuración de eliminación en cascada
});

/*-- Establece la relación de uno a muchos entre exhibits_conversation y exhibits_conversation_audios --*/
db.exhibits_conversation.hasMany(db.exhibits_conversation_audios, {
  foreignKey: 'conversationID',
  onDelete: 'CASCADE' // Eliminación en cascada cuando se elimina la conversación asociada
});
db.exhibits_conversation_audios.belongsTo(db.exhibits_conversation, {
  foreignKey: 'conversationID',
  onDelete: 'CASCADE' // Eliminación en cascada cuando se elimina la conversación asociada
});

/*-- Establece la relación de uno a uno entre exhibits y exhibits_gif con eliminación en cascada --*/
db.exhibits.hasOne(db.exhibits_gif, {
  foreignKey: 'exhibitID',
  onDelete: 'CASCADE'
});
db.exhibits_gif.belongsTo(db.exhibits, {
  foreignKey: 'exhibitID',
  onDelete: 'CASCADE' // Eliminación en cascada cuando se elimina la exhibición.
});

/*-- Establece la relación de uno a uno entre exhibits y exhibits_text con eliminación en cascada--*/
db.exhibits.hasOne(db.exhibits_text, {
  foreignKey: 'exhibitID',
  onDelete: 'CASCADE' // Eliminación en cascada cuando se elimina la exhibición asociada
});
db.exhibits_text.belongsTo(db.exhibits, {
  foreignKey: 'exhibitID',
  onDelete: 'CASCADE' // Eliminación en cascada cuando se elimina la exhibición asociada
});
/* -- Define los roles disponibles en la base de datos -- */
db.ROLES = ["user", "admin", "moderator"];


/* -- Exporta el objeto db para que pueda ser utilizado en otros archivos -- */
module.exports = db;