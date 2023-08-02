module.exports = (sequelize, Sequelize) => {
    const ExhibitImage = sequelize.define("exhibits_images", {
      imageID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      exhibitID: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      image_url: {
        type: Sequelize.STRING(255),
        allowNull: false
      }
    });
  
    return ExhibitImage;
  };