module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'SceneData',
      'type',
      {
          type: Sequelize.ENUM("text", "xml", "json"),
          allowNull: false
      }
    );
  },

  down: function (queryInterface) {
    return queryInterface.changeColumn(
      'SceneData',
      'type',
      {
          type: Sequelize.ENUM("text", "xml"),
          allowNull: false
      }
    );
  }
};
