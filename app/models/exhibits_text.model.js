module.exports = (sequelize, Sequelize) => {
    const ExhibitText = sequelize.define("exhibits_text", {
      textID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      exhibitID: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      text: {
        type: Sequelize.TEXT('long'),
        allowNull: false
      },
      text_audio_url: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
    });
  
    return ExhibitText;
  };