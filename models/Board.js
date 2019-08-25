'use strict';
module.exports = (sequelize, DataTypes) => {
  const Board = sequelize.define('Board', {
    uri: DataTypes.STRING,
    title: DataTypes.STRING
  }, {});
  Board.associate = function(models) {
    // associations can be defined here
  };
  return Board;
};