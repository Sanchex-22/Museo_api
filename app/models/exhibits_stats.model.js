/* -- Exporta una función que define y vuelve el modelo de exhibits_stats -- */
module.exports = (sequelize,Sequelize) => {

    /* -- Define el modelo de exhibits_stats con el nombre "exhibits_stats" --*/
    const ExhibitsStats = sequelize.define("exhibits_stats", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        totalLikes: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        totalViews: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        totalShares: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });
    return ExhibitsStats;
};