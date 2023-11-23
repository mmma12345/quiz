const db = require('../../mysql/db');
const bcrypt = require('bcrypt');
const user = require('../../mysql/Models/Users');
const file = require('../readFile');

function index(req, res){
  let user;
  if (req.isAuthenticated()) {
    user = req.user.displayName;  
  } else if (req.session.user) {
    user = req.session.user;
  }
  res.render('layouts/all', {content : '../auth/login.ejs', user: user});

  // return file.view(req, res, 'views/auth/login.ejs');
}

function Login(req, res){
  user.Login(req, res);
}

module.exports = { index, Login };