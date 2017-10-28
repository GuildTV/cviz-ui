export default function(sequelize, DataTypes) {
  return sequelize.define('SceneData', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    SceneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("text", "xml", "json"),
      allowNull: false,
    },

    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    classMethods:{
      associate: function(models){
        models.SceneData.belongsTo(models.Scene);
      }
    }
  });
}
