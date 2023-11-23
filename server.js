const express = require('express');
const session = require('express-session');
const path = require('path'); 
const multer = require('multer');
const bodyParser = require('body-parser');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const user = require('./mysql/Models/Users');
const app = express();
const port = 3000;
const twoWeeksInMilliseconds = 14 * 24 * 60 * 60 * 1000; 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('public'));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/cover');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});


const upload = multer({ storage: storage });

app.use(session({
  secret: 'user', 
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: twoWeeksInMilliseconds,
  },
}));

app.use(passport.initialize());
app.use(passport.session());


passport.use(new FacebookStrategy({
  clientID: '1332174937431981',
  clientSecret: '2cb7c04e8b3e6af3ddecb02826f5a51c',
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email']
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.get('/privacy-policy', (req, res) => {
  res.render('privacy_policy');
});

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' })
);

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next(); // User is authenticated, continue to the next middleware or route handler
//   }
//   // User is not authenticated, redirect to a login page or display an error
//   res.redirect('/login'); // Adjust the path as needed
// }

app.get('/logout', (req, res) => {
  req.logout(() => {});
  res.redirect('/login');
});


const HomeController = require('./Controllers/HomeController');
const AdminController = require('./Controllers/Admin/AdminController');
// app.get('/', HomeController.index);

const LoginController = require('./Controllers/Auth/LoginController');
const RegisterController = require('./Controllers/Auth/RegisterController');
const CategoryController = require('./Controllers/CategoryController');
const GameController = require('./Controllers/GameController');

//auths
app.get('/login', user.checkForAuths, LoginController.index);
app.post('/login', LoginController.Login);

app.get('/register', user.checkForAuths, RegisterController.index);
app.post('/register', RegisterController.store);

app.get('/', user.checkForHomePage, HomeController.index);

//games
app.get('/games', user.check,CategoryController.index);
app.get('/games/category/:id', user.check, CategoryController.show);
app.get('/games/:titleId', user.check,  GameController.index);
app.post('/play-again/:titleId', user.check,  GameController.playagain);
app.post('/games/:titleId', user.check,   GameController.getQuestion);
app.post('/quiz/check-answer', user.check,   GameController.checkAnswer);

//admin
app.get('/admin',AdminController.index);
app.get('/admin/create',AdminController.create);
app.post('/admin/store', upload.single('image'), AdminController.store);
app.get('/admin/questions',AdminController.index);
app.get('/admin/questions/:categoryid',AdminController.edit);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
