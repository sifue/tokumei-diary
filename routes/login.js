'use strict';
const express = require('express');
const router = express.Router();
const config = require('../config');

router.get('/', (req, res, next) => {
    res.render('login', {
        user: req.user,
        permittedDomain: config.PERMITTED_DOMAIN
    });
});

module.exports = router;