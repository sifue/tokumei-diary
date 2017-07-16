'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('../authentication-ensurer');
const Diary = require('../../models/diary');
const moment = require('moment');

router.get('/', authenticationEnsurer, (req, res, next) => {
  res.render('diaries/new', { 
    user: req.user,
    title: '日記を書く'
   });
});

router.post('/', authenticationEnsurer, (req, res, next) => {
  if(req.body.title.trim() === '' || req.body.body.trim() === '') {
    res.render('diaries/is-empty', {
      title: 'タイトルまたは本文が空の投稿はできません。',
      user: req.user
    });
  } else {
    const diaryId = moment(new Date()).format('YYYYMMDDHHmmssSSS');
    Diary.create({
      diaryId: diaryId,
      title: req.body.title.slice(0, Diary.titleMaxLength),
      body: req.body.body.slice(0, Diary.bodyMaxLength),
      userId: req.user.id,
      isDeleted: false,
      deletedBy: null
    }).then(() => {
      res.redirect('/');
    });
  }
});
module.exports = router;