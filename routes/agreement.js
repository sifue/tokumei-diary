'use strict';
const express = require('express');
const router = express.Router();
const config = require('../config');

router.get('/', (req, res, next) => {
    res.render('agreement', {
        title: config.LETTER_TITLE,
        description: config.LETTER_SUB_TITLE,
        user: req.user,
        config: config
    });
});

module.exports = router;