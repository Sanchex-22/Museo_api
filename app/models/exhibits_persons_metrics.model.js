module.exports = (sequelize, Sequelize) => {
    const ExhibitsPersonsMetrics = sequelize.define("exhibits_persons_metrics", {
      exhibitID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      personID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      visits: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      shares: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      likes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
    });
  
    return ExhibitsPersonsMetrics;
  };