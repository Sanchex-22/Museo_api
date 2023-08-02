/*-- Exporta una función que define y devuelve el modelo de ExhibitConversationAudio --*/
module.exports = (sequelize, Sequelize) => {

    /*-- Define el modelo de exhibits_conversation_audios con el nombre de exhibits_conversation_audios --*/
    const ExhibitConversationAudio = sequelize.define("exhibits_conversation_audios", {
        audioID: {
            type: Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement: true
        },
        conversationID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        audio_url: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        audio_order: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        audio_message: {
            type: Sequelize.TEXT('medium'),
            allowNull: false
        }
    });
    return ExhibitConversationAudio;
};