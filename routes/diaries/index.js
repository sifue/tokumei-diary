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

router.get('/:diaryId/edit', function (req, res, next) {

  Diary.findOne({
    where: {
      diaryId: req.params.diaryId,
      isDeleted: false
    }
  }
  ).then((diary) => {

    if (diary) {
      diary.sanitizedTitle = sanitizer(diary.title);

      let isMine = false;
      if (req.user) {
        isMine = diary.userId === req.user.id
      }

      if (isMine) {
        res.render('diaries/edit', {
          title: '日記の編集 - ' + diary.sanitizedTitle,
          diary: diary,
          user: req.user,
          moment: moment
        });
      } else {
        res.render('diaries/not-found', {
          title: 'お探しの日記は、あなたによって投稿されていません。',
          user: req.user
        });
      }

    } else {
      res.render('diaries/not-found', {
        title: 'お探しの日記は、削除されたか存在しません。',
        user: req.user
      });
    }
  });

});

router.post('/:diaryId/edit', function (req, res, next) {

  if (req.body.title.trim() === '' || req.body.body.trim() === '') {
    res.render('diaries/is-empty', {
      title: 'タイトルまたは本文が空の投稿はできません。',
      user: req.user
    });
  } else {

    Diary.findOne({
      where: {
        diaryId: req.body.diaryId,
        isDeleted: false
      }
    }
    ).then((diary) => {

      if (diary) {
        diary.sanitizedTitle = sanitizer(diary.title);
        let isMine = false;
        if (req.user) {
          isMine = diary.userId === req.user.id
        }

        if (isMine) {
          Diary.upsert({
            diaryId: req.body.diaryId,
            title: req.body.title.slice(0, Diary.titleMaxLength),
            body: req.body.body.slice(0, Diary.bodyMaxLength),
            userId: req.user.id,
            isDeleted: false
          }).then(() => {
            res.redirect('/diaries/' + req.body.diaryId);
          });
        } else {
          res.render('diaries/not-found', {
            title: 'お探しの日記は、あなたによって投稿されていません。',
            user: req.user
          });
        }

      } else {
        res.render('diaries/not-found', {
          title: 'お探しの日記は、削除されたか存在しません。',
          user: req.user
        });
      }
    });
  }
});

module.exports = router;
