'use strict';

const config = require('../../config');
const Twitter = require('twitter');
const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

/**
 * Post to twitter with Diary
 * @param {Diary} diary 
 */
function post(diary) {
  if(!process.env.TWITTER_CONSUMER_KEY) return;

  let statusMessage = config.TWITTER_POST_MESSAGE+ '"';
  let url = config.MY_SITE_ROOT + 'diaries/' + diary.diaryId;
  let lest = 140 - statusMessage.length - url.length - 4;
  const regexp = new RegExp(config.DIARY_URL_REGEXP_TEXT, 'g');
  if(diary.title.match(regexp)) { // title is URL
    statusMessage += diary.body.substring(0, lest) + '" ' + url;
  } else {
    statusMessage += diary.title.substring(0, lest) + '" ' + url;
  }

  client.post('statuses/update', {status: statusMessage})
  .then(function (tweet) {
    console.log('Tweet posted. : ' + statusMessage );
    // console.log(tweet);
  })
  .catch(function (error) {
    throw error;
  });
}

module.exports = {
  post: post
};