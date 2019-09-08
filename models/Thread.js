'use strict';
module.exports = (sequelize, DataTypes) => {
  const Thread = sequelize.define('Thread', {
    name: DataTypes.STRING,
    subject: DataTypes.STRING,
    body: DataTypes.STRING,
    file_id: DataTypes.STRING,
    filename: DataTypes.STRING,
    filesize: DataTypes.INTEGER,
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    ext: DataTypes.STRING,
    replies: DataTypes.INTEGER,
    images: DataTypes.INTEGER,
    bump: DataTypes.DATE,
    ips: DataTypes.INTEGER,
    archived: DataTypes.BOOLEAN,
    boardId: DataTypes.BOOLEAN,
    postId: DataTypes.INTEGER,
  }, {});
  Thread.associate = function(models) {
    Thread.belongsTo(models.Board);
    Thread.hasMany(models.Reply);
  };
  return Thread;
};