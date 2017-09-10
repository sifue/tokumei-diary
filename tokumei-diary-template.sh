#!/bin/bash
env NODE_ENV=development \
PORT=8000 \
GOOGLE_CLIENT_ID=xxxxxxxxxxx-xxxxxxxxxxxxx.apps.googleusercontent.com \
GOOGLE_CLIENT_SECRET=xxxxx-xxxxxxx \
GOOGLE_CLIENT_CALLBACL_ROOT='http://localhost:8000/' \
TWITTER_CONSUMER_KEY=xxxxxxxxxxxxx \
TWITTER_CONSUMER_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
TWITTER_ACCESS_TOKEN_KEY=xxxxxx-xxxxxxxxxxxxxxxxxx \
TWITTER_ACCESS_TOKEN_SECRET=xxxxxxxxxxxxxxxx \
npm start  2>&1 | tee application.log