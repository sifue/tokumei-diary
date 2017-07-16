'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'postgres://postgres:postgres@localhost/n_tokumei',
  { logging: !(process.env.NODE_ENV === 'production') });

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};