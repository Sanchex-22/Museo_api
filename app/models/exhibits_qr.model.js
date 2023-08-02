/*-- Exporta una función que define y devuelve el modelo de ExhibitQR --*/
module.exports = (sequelize, Sequelize) => {

    /*-- Define el modelo de exhibits_qr con el nombre de exhibits_qr --*/
    const ExhibitQR = sequelize.define("exhibits_qr", {
        qrID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        qr_url: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        exhibitID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
    });
    return ExhibitQR;
};