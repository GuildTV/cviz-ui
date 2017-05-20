export default function(sequelize, DataTypes) {
  return sequelize.define('Playlist', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    classMethods:{
      associate: function(models){
        models.Playlist.hasMany(models.PlaylistEntry);
      }
    }
  });
}
