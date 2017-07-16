'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Trackback = loader.database.define('trackbacks', {
  fromDiaryId: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  toDiaryId: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  }
}, {
    freezeTableName: true,
    timestamps: true,
    indexes: [
      {
        fields: ['toDiaryId', 'fromDiaryId']
      }
    ]
  });

module.exports = Trackback;