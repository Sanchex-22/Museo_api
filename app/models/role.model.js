/* -- Exporta una función que define y devuelve el modelo de rol -- */
module.exports = (sequelize, Sequelize) => {

  /* -- Define el modelo de rol con el nombre "roles" -- */
  const Role = sequelize.define("roles", {
    id: {
      type: Sequelize.INTEGER,   // Campo "id" de tipo INTEGER en la tabla de la base de datos
      primaryKey: true,           // Indica que este campo es la clave primaria de la tabla
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING     // Campo "name" de tipo STRING en la tabla de la base de datos
    }
  });

  return Role;   // Devuelve el modelo de rol definido
};
