/*-- Exporta una función que define y devuelve el modelo de ExhibitGif --*/
module.exports = (sequelize, Sequelize) => {

    /*-- Define el modelo de exhibits_gif --*/
   const ExhibitGif = sequelize.define("exhibits_gif", {
    exhibitID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    gif_url: {
        type: Sequelize.STRING(255),
        allowNull: false
    }
   });
    return ExhibitGif;
};