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

var PERMITTED_DOMAIN = 'nnn.ed.jp';

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

if(!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error('Please start with ENV params. ex: PORT=8000 GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxx.apps.googleusercontent.com GOOGLE_CLIENT_SECRET=xxxxxxx-xxxxxxxxxxxxxxx npm start');
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
  callbackURL: 'http://localhost:8000/auth/google/callback'
},
  (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => {
      // Check domain
      const emails = profile.emails;
      const emailRegExp = new RegExp('.+@' + PERMITTED_DOMAIN + '$');
      let isPermittedDomain = false;
      emails.forEach(e => {
        if (e.type = 'account' && e.value.match(emailRegExp)) {
          isPermittedDomain = true;
        }
      }
      );

      if(isPermittedDomain) {
        return done(null, profile);
      } else {
        return done(null, false,
           { message: 'ログインは、' + PERMITTED_DOMAIN　+ 'ドメインのEmailアドレスでのみ認証可能です。'});
      }
    });
  }
));

var index = require('./routes/index');
var login = require('./routes/login');
login.permittedDomain = PERMITTED_DOMAIN;
var logout = require('./routes/logout');

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

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
  function (req, res) {
  });

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login'}),
  function (req, res) {
    res.redirect('/');
  });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
