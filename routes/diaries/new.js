'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('../authentication-ensurer');
const Diary = require('../../models/diary');
const moment = require('moment');

router.get('/', authenticationEnsurer, (req, res, next) => {
  res.render('diaries/new', { user: req.user });
});

router.post('/', authenticationEnsurer, (req, res, next) => {
  console.log(req.body); // TODO 予定と候補を保存する実装をする
  const diaryId = moment(new Date()).format('YYYYMMDDHHmmssSSS');
  Diary.create({
    diaryId: diaryId,
    title: req.body.title.slice(0, 255),
    body: req.body.body,
    userId: req.user.id,
    isDeleted: false
  }).then(() => {
    res.redirect('/');
  });
});
module.exports = router;