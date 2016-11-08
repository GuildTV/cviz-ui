module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'Scenes',
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
        template: {
          type: Sequelize.STRING,
          allowNull: false
        },

        order: {
          type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('Scenes');
  }
};
