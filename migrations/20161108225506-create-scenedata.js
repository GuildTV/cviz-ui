module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable(
      'SceneData',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
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

        name: {
          type: Sequelize.STRING,
          allowNull: false
        },

        value: {
          type: Sequelize.TEXT,
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
    ).then(function(){
      return queryInterface.addIndex(
        'SceneData',
        ['SceneId', 'name'],
        {
          indexName: 'scene_name_unique',
          indicesType: 'UNIQUE'
        }
      );
    });
  },

  down: function (queryInterface) {
    return queryInterface.dropTable('SceneData');
  }
};
