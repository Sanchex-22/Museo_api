/*-- Exporta una función que define y devuelve el modelo de ExhibitConversation --*/
module.exports = (sequelize, Sequelize) => {

    /*-- Define el modelo de exhibits_conversation con el nombre de exhibits_conversation --*/
    const ExhibitConversation = sequelize.define("exhibits_conversation", {
        conversationID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        exhibitID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        conversationName: {
            type: Sequelize.STRING(50),
            allowNull: false
        }
    });
    return ExhibitConversation;
};