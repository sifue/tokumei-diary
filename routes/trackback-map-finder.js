'use strict';

const Diary = require('../models/diary');
const Trackback = require('../models/trackback');

/**
 * Find all trackback
 * @param {*} toDiaryIds 
 * @param {*} next 
 */
function trackbackMapFinder(toDiaryIds, next) {
  Trackback.findAll({
    where: {
      toDiaryId: {
        $in: toDiaryIds
      }
    },
    order: [['toDiaryId', 'DESC'], ['fromDiaryId', 'ASC']],
  }).then((trackbacks) => {

    const mapFromDiaryIds = new Map();
    trackbacks.forEach((trackback) => {
      if(!mapFromDiaryIds.has(trackback.toDiaryId)) {
        mapFromDiaryIds.set(trackback.toDiaryId, []);
      }
      const fromDiaryIds = mapFromDiaryIds.get(trackback.toDiaryId);
      fromDiaryIds.push(trackback.fromDiaryId);
      mapFromDiaryIds.set(trackback.toDiaryId, fromDiaryIds);
    });

    next(mapFromDiaryIds);
  });
}

module.exports = trackbackMapFinder;