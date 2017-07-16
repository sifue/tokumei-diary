var express = require('express');
var router = express.Router();
const authenticationEnsurer = require('../authentication-ensurer');
const moment = require('moment');
const Diary = require('../../models/diary');
const sanitizer = require('../sanitizer');
const config = require('../../config');

router.get('/', authenticationEnsurer, function (req, res, next) {
  Diary.findAll({
      where: {
        isDeleted: false,
        userId: req.user.id
      },
      order: [['diaryId', 'DESC']]
    }
  ).then((diaries) => {

      diaries.forEach((diary) => {
        diary.sanitizedTitle = sanitizer(diary.title);
        diary.sanitizedBody = sanitizer(diary.body);
        let isMine = false;
        if(req.user) {
          isMine = diary.userId === req.user.id;
        }
        diary.isMine = isMine;
      })

      let isDeleteExecutor = false;
      if(req.user) {
          isDeleteExecutor = config.isDeleteExecutor(req.user.id);
      }

      res.render('diaries/my', {
        title: req.user.displayName + ' の日記',
        diaries: diaries,
        user: req.user,
        moment: moment,
        config: config,
        isDeleteExecutor: isDeleteExecutor
      });
    });
});

module.exports = router;
