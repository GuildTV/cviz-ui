module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'PlaylistEntries',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },

        PlaylistId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Playlists",
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },

        SceneId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Scenes",
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
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
    return queryInterface.dropTable('PlaylistEntries');
  }
};
