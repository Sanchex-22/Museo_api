/*-- Exporta una función que define y devuelve el modelo de ExhibitVideo --*/
module.exports = (sequelize, Sequelize) => {

    /*-- Define el modelo de exhibits_videos con el nombre de exhibits_videos --*/
    const ExhibitVideo = sequelize.define("exhibits_videos", {
        exhibitID: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        video_url: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
    });
    return ExhibitVideo;
};