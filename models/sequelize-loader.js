'use strict';
const config = require('../config');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  config.POSTGRESQL_URL,
  { logging: !(process.env.NODE_ENV === 'production') });

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};