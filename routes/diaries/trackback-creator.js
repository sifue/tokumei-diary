'use strict';

const Diary = require('../../models/diary');
const Trackback = require('../../models/trackback');
const config = require('../../config');

/**
 * Create trackbacks from Diary
 * @param {Diary} fromDiary 
 * @param {*} next 
 */
function trackbackCreator(fromDiary, next) {

    if(!fromDiary) {
        next();
        return;
    }

    const context = fromDiary.title + ' ' + fromDiary.body;
    const regexp = new RegExp(config.DIARY_URL_REGEXP_TEXT, 'g');
    const matchDiaryIds = [];

    let result = null;
    while ((result = regexp.exec(context)) != null) {
        matchDiaryIds.push(result[2]);
    }

    const promiseTrackbacks = [];
    matchDiaryIds.forEach((toDiaryId) => {
        const promiseTrackback = Diary.findOne({
            where: {
                diaryId: toDiaryId,
                isDeleted: false
            }
        }).then((toDiary) => {
            if (toDiary) {
                return Trackback.upsert({
                    fromDiaryId: fromDiary.diaryId,
                    toDiaryId: toDiary.diaryId
                });
            }
        });
        promiseTrackbacks.push(promiseTrackback);
    });

    Promise.all(promiseTrackbacks).then(() => {
        next();
    })
}

module.exports = trackbackCreator;