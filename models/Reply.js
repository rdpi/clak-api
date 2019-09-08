'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    name: DataTypes.STRING,
    body: DataTypes.STRING,
    file_id: DataTypes.STRING,
    filename: DataTypes.STRING,
    filesize: DataTypes.INTEGER,
    width: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    ext: DataTypes.STRING,
    threadId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
  }, {});
  Reply.associate = function(models) {
    Reply.belongsTo(models.Thread);
  };
  return Reply;
};