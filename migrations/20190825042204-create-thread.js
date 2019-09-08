'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Threads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(30),
        defaultValue: 'Anonymous',
      },
      subject: {
        type: Sequelize.STRING(100),
      },
      body: {
        type: Sequelize.STRING(2000),
        allowNull: false,
      },
      file_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      filename: {
        type: Sequelize.STRING,
      },
      filesize: {
        type: Sequelize.INTEGER,
      },
      width: {
        type: Sequelize.INTEGER,
      },
      height: {
        type: Sequelize.INTEGER,
      },
      ext: {
        type: Sequelize.STRING,
      },
      replies: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      images: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      bump: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      ips: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      boardId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      archived: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
        postId: {
          type: Sequelize.INTEGER,
        }
      },
      postId: {
        type: Sequelize.INTEGER,
      },
    }, {timestamps: true});
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Threads');
  }
};