'use strict';
module.exports = (sequelize, DataTypes) => {
  const Board = sequelize.define('Board', {
    uri: DataTypes.STRING,
    title: DataTypes.STRING,
    posts: DataTypes.INTEGER,
  }, {});
  Board.associate = function(models) {
    Board.hasMany(models.Thread);
  };
  return Board;
};