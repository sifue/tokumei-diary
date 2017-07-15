'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  'postgres://postgres:postgres@localhost/n_tokumei',
  { logging: true });

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};