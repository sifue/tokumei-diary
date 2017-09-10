'use strict';

const config = {
    PERMITTED_DOMAIN: 'nnn.ed.jp',
    POSTGRESQL_URL: 'postgres://postgres:postgres@localhost/n_tokumei',
    MY_SITE_ROOT: process.env.GOOGLE_CLIENT_CALLBACL_ROOT,
    TWITTER_HASHTAG: 'N高匿名ダイアリー',
    TWITTER_CARDS_IMG: 'https://n-tokumei.soichiro.org/images/n-tokumei_200px.png',
    TWITTER_POST_MESSAGE: '#N高匿名ダイアリー の新規投稿 ',
    LETTER_TITLE: 'N高 匿名ダイアリー',
    LETTER_SUB_TITLE: 'N高等学校関係者だけが書き込める公開日記で、名前を隠して楽しく日記。',
    LETTER_OPERATOR: 'Soichiro Yoshimura',
    LETTER_MAIL_DOMAIN_OWNER: 'N高等学校',
    DELETE_EXECUTOR_IDS: [
        '117091664744922161167'
    ],
    isDeleteExecutor: (id) => {
        return config.DELETE_EXECUTOR_IDS.includes(id);
    },
    DIARY_URL_REGEXP_TEXT: 'https?:\/\/(localhost:[0-9]+|n-tokumei\.soichiro\.org)\/diaries\/([0-9]+)'
};

module.exports = config;