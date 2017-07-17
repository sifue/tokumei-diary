var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var helmet = require('helmet');
var session = require('express-session');
var passport = require('passport');
var favicon = require('serve-favicon');
var config = require('./config');

// Load data models and sync.
var User = require('./models/user');
var Diary = require('./models/diary');
var Trackback = require('./models/trackback');
User.sync().then(() => {
  Diary.belongsTo(User, {foreignKey: 'userId'});
  Diary.sync().then(() => {
    Trackback.belongsTo(Diary, {foreignKey: 'fromDiaryId'});
    Trackback.belongsTo(Diary, {foreignKey: 'toDiaryId'});
    Trackback.sync();
  });
});

var GoogleStrategy = require('passport-google-oauth20').Strategy;
var GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
var GOOGLE_CLIENT_CALLBACL_ROOT = process.env.GOOGLE_CLIENT_CALLBACL_ROOT;

if(!GOOGLE_CLIENT_ID ||
   !GOOGLE_CLIENT_SECRET || 
   !GOOGLE_CLIENT_CALLBACL_ROOT) {
  throw new Error('Please start with ENV params. ex: PORT=8000 GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxx.apps.googleusercontent.com GOOGLE_CLIENT_SECRET=xxxxxxx-xxxxxxxxxxxxxxx GOOGLE_CLIENT_CALLBACL_ROOT=\'http://localhost:8000/\' npm start');
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL:  GOOGLE_CLIENT_CALLBACL_ROOT + 'auth/google/callback'
},
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      // Check domain
      const emails = profile.emails;
      const emailRegExp = new RegExp('.+@' + config.PERMITTED_DOMAIN + '$');
      let isPermittedDomain = false;
      emails.forEach(e => {
        if (e.type = 'account' && e.value.match(emailRegExp)) {
          isPermittedDomain = true;
        }
      }
      );

      if (isPermittedDomain) {
        User.findOne({
          where: {
            userId: profile.id
          }
        }).then((user) => {
          if(!user || !user.isBan) { // 未登録ユーザー or 非BANユーザーは追加更新
            User.upsert({
              userId: profile.id,
              displayName: profile.displayName,
              emails: JSON.stringify(profile.emails),
              photos: JSON.stringify(profile.photos),
              isBan: false,
              isDeleteExecutor: config.isDeleteExecutor(profile.id)
            }).then(() => {
              done(null, profile);
            });
            return done(null, profile);
          } else {
            return done(null, false,
              { message: 'あなたのアカウントはバンされています。' });
          }
        });
      } else {
        return done(null, false,
          { message: 'ログインは、' + config.PERMITTED_DOMAIN 　+ 'ドメインのEmailアドレスでのみ認証可能です。' });
      }
    });
  }
));

var index = require('./routes/index');
var login = require('./routes/login');
var logout = require('./routes/logout');
var agreement = require('./routes/agreement');
var diariesNew = require('./routes/diaries/new');
var diariesMy = require('./routes/diaries/my');
var diariesIndex = require('./routes/diaries/index');

var app = express();
app.use(helmet());
app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: process.env.GOOGLE_CLIENT_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/login', login);
app.use('/logout', logout);
app.use('/agreement', agreement);
app.use('/diaries/new', diariesNew);
app.use('/diaries/my', diariesMy);
app.use('/diaries/', diariesIndex);

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
  function (req, res) {
  });

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    var loginFrom = req.cookies.loginFrom;
    if (loginFrom &&
      loginFrom.substr(0, 1) === '/') { // from document root
      res.clearCookie('loginFrom');
      res.redirect(loginFrom);
    } else {
      res.redirect('/');
    }
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {

  if (res.headersSent) {
    return next(err);
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
        user: req.user,
        config: config
  });
});

module.exports = app;
