'use strict';
const express = require('express');
const router = express.Router();
const config = require('../config');

router.get('/', (req, res, next) => {
    const from = req.query.from;
    if (from) {
      res.cookie('loginFrom', from, { expires: new Date(Date.now() + 600000)});
    }
    res.render('login', {
        title: 'ログイン - ' + config.LETTER_TITLE,
        description: config.LETTER_SUB_TITLE,
        user: req.user,
        permittedDomain: config.PERMITTED_DOMAIN,
        config: config
    });
});

module.exports = router;