'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Diary = loader.database.define('diaries', {
  diaryId: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  body: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  isDeleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
}, {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['isDeleted']
      }
    ]
  });

module.exports = Diary;