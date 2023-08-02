/*-- Exporta una función que define y devuelve el modelo del rol --*/
module.exports = (sequelize, Sequelize) => {

    /*-- Define el modelo de información de usuario con el nombre "persons" --*/
    const persons = sequelize.define("persons",{
        personID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING(50),
            allowNull: false
        },
        identification: {
            type: Sequelize.STRING,
            allowNull: false
        },
        birth_date: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        profile_picture: {
            type: Sequelize.STRING(100),
        }
    });

    return persons;
};