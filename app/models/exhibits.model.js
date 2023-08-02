/*-- Exporta una función que define y devuelve el modelo de Exhibicion --*/
module.exports = (sequelize, Sequelize) => {

    /*-- Define el modelo de exhibits con el nombre de exhibits --*/
    const Exhibit = sequelize.define("exhibits", {
        exhibitID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        short_desc_url: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        founder: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        creation_date: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        categoryID: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
    return Exhibit;
};