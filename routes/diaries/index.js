'use strict';
var express = require('express');
var router = express.Router();
const moment = require('moment');
const Diary = require('../../models/diary');
const sanitizer = require('../sanitizer')
const config = require('../../config');
const trackbackCreator = require('./trackback-creator');
const trackbackMapFinder = require('../trackback-map-finder');


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

      let isDeleteExecutor = false;
      if(req.user) {
        isDeleteExecutor = config.isDeleteExecutor(req.user.id);
      }

      // find trackbacks
      trackbackMapFinder([diary.diaryId], function (mapFromDiaryIds) {
        res.render('diaries/index', {
          title: diary.sanitizedTitle,
          diary: diary,
          user: req.user,
          moment: moment,
          isMine: isMine,
          config: config,
          isDeleteExecutor: isDeleteExecutor,
          fromDiaryIds: mapFromDiaryIds.get(diary.diaryId)
        });
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
            isDeleted: false,
            deletedBy: diary.deletedBy
          }).then(() => {
            // Create Trackback
            Diary.findOne({
              where: {
                diaryId: req.body.diaryId,
                isDeleted: false
              }
            }).then((fromDiary) => {
              trackbackCreator(fromDiary, function () {
                res.redirect('/diaries/' + req.body.diaryId);
              });
            });
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

router.post('/:diaryId/delete', function (req, res, next) {

  Diary.findOne({
    where: {
      diaryId: req.body.diaryId,
      isDeleted: false
    }
  }
  ).then((diary) => {

    if (diary) {
      let isMine = false;
      if (req.user) {
        isMine = diary.userId === req.user.id
      }

      let isDeleteExecutor = false;
      if(req.user) {
          isDeleteExecutor = config.isDeleteExecutor(req.user.id);
      }

      if (isMine || isDeleteExecutor) {
        Diary.upsert({
          diaryId: req.body.diaryId,
          title: diary.title,
          body: diary.body,
          userId: diary.userId,
          isDeleted: true,
          deletedBy: req.user.id
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

});

module.exports = router;
