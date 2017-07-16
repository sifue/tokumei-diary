'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const User = loader.database.define('users', {
  userId: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  displayName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  emails: {
    type: Sequelize.STRING,
    allowNull: false
  },
  photos: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isBan: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  },
  isDeleteExecutor: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
}, {
    freezeTableName: true,
    timestamps: true
  });

module.exports = User;