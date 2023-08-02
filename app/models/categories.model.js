/*-- Exporta una función que define y devuelve el modelo de categoría --*/
module.exports = (sequelize, Sequelize) => {

    /*-- Define el modelo de categorías con el nombre "categories" --*/
    const Category = sequelize.define("categories", {
        categoryID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        category: {
            type: Sequelize.STRING(50),
            allowNull: false
        }
    });
    return Category;
};