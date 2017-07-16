'use strict';
var express = require('express');
var router = express.Router();
const moment = require('moment');
const Diary = require('../../models/diary');
const sanitizer = require('../sanitizer')

router.get('/:diaryId', function (req, res, next) {
  Diary.findOne({
      where: {
        diaryId: req.params.diaryId,
        isDeleted: false
      }
  }
  ).then((diary) => {

    if (diary) {
      diary.sanitizedTitle = sanitizer(diary.title);
      diary.sanitizedBody = sanitizer(diary.body);
      let isMine = false;
      if (req.user) {
        isMine = diary.userId === req.user.id
      }

      res.render('diaries/index', {
        title: diary.sanitizedTitle,
        diary: diary,
        user: req.user,
        moment: moment,
        isMine: isMine
      });
    } else {
      res.render('diaries/not-found', {
        title: 'お探しの日記は、削除されたか存在しません。',
        user: req.user
      });
    }
  });

});

module.exports = router;
