var express = require('express');
var router = express.Router();
const moment = require('moment');
const Diary = require('../models/diary');

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
      res.render('index', {
        title: 'N高 匿名ダイアリー',
        diaries: diaries,
        user: req.user,
        moment: moment
      });
    });
});

module.exports = router;
