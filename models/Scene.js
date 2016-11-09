export default function(sequelize, DataTypes) {
  return sequelize.define('Scene', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    template: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    colour: {
      type: DataTypes.STRING(7),
      allowNull: true,
    }
  }, {
    classMethods:{
      associate: function(models){
        models.Scene.hasMany(models.SceneData);
      }
    }
  });
}
