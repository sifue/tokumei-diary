'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('../authentication-ensurer');

router.get('/', authenticationEnsurer, (req, res, next) => {
  res.render('diaries/new', { user: req.user });
});

module.exports = router;