export default function(sequelize, DataTypes) {
  return sequelize.define('PlaylistEntry', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    PlaylistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    SceneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    classMethods:{
      associate: function(models){
        models.PlaylistEntry.belongsTo(models.Playlist);
        models.PlaylistEntry.belongsTo(models.Scene);
      }
    }
  });
}
