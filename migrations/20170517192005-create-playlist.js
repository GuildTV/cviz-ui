module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'Playlists',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },

        name: {
          type: Sequelize.STRING,
          allowNull: false
        },

        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        }
      },{
        charset: 'utf8'
      }
    );
  },

  down: function (queryInterface) {
    return queryInterface.dropTable('Playlists');
  }
};
