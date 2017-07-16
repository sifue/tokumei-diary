var express = require('express');
var router = express.Router();
const moment = require('moment');
const Diary = require('../models/diary');
const Trackback = require('../models/trackback');
const sanitizer = require('./sanitizer');
const config = require('../config');
const trackbackMapFinder = require('./trackback-map-finder');

/* GET home page. */
router.get('/', function (req, res, next) {
  Diary.findAll({
      where: {
        isDeleted: false
      },
      order: [['diaryId', 'DESC']],
      limit: 20
  }
  ).then((diaries) => {

    const toDiaryIds = [];
    diaries.forEach((diary) => {
      diary.sanitizedTitle = sanitizer(diary.title);
      diary.sanitizedBody = sanitizer(diary.body);
      let isMine = false;
      if (req.user) {
        isMine = diary.userId === req.user.id;
      }
      diary.isMine = isMine;
      toDiaryIds.push(diary.diaryId);
    })

    let isDeleteExecutor = false;
    if (req.user) {
      isDeleteExecutor = config.isDeleteExecutor(req.user.id);
    }

    // find trackbacks
    trackbackMapFinder(toDiaryIds, function (mapFromDiaryIds) {
      res.render('index', {
        title: 'N高 匿名ダイアリー',
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
