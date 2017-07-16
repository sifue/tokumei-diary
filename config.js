'use strict';

const config = {
    PERMITTED_DOMAIN: 'nnn.ed.jp',
    MY_SITE_ROOT: 'https://n-tokumei.soichiro.org/',
    TWITTER_HASHTAG: 'N高匿名ダイアリー',
    DELETE_EXECUTOR_IDS: [
        '117091664744922161167'
    ],
    isDeleteExecutor: (id) => {
        return config.DELETE_EXECUTOR_IDS.includes(id);
    }
};

module.exports = config;