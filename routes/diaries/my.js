var express = require('express');
var router = express.Router();
const authenticationEnsurer = require('../authentication-ensurer');
const moment = require('moment');
const Diary = require('../../models/diary');
const sanitizer = require('../sanitizer');
const config = require('../../config');
const trackbackMapFinder = require('../trackback-map-finder');

router.get('/', authenticationEnsurer, function (req, res, next) {
  Diary.findAll({
      where: {
        isDeleted: false,
        userId: req.user.id
      },
      order: [['diaryId', 'DESC']]
    }
  ).then((diaries) => {

      const toDiaryIds = [];
      diaries.forEach((diary) => {
        diary.sanitizedTitle = sanitizer(diary.title);
        diary.sanitizedBody = sanitizer(diary.body);
        let isMine = false;
        if(req.user) {
          isMine = diary.userId === req.user.id;
        }
        diary.isMine = isMine;
        toDiaryIds.push(diary.diaryId);
      });

      let isDeleteExecutor = false;
      if(req.user) {
          isDeleteExecutor = config.isDeleteExecutor(req.user.id);
      }

      // find trackbacks
      trackbackMapFinder(toDiaryIds, function (mapFromDiaryIds) {
        res.render('diaries/my', {
          title: req.user.displayName + ' の日記',
          description: config.LETTER_SUB_TITLE,
          diaries: diaries,
          user: req.user,
          moment: moment,
          config: config,
          isDeleteExecutor: isDeleteExecutor,
          mapFromDiaryIds: mapFromDiaryIds
        });
      });
    });
});

module.exports = router;
