// controllers/quizController.js
const quizQueries = require('../mysql/queries');
const Category = require('../mysql/Models/Category');
const Question = require('../mysql/Models/Question1');
const file = require('./readFile');

function index(req, res){
  let user;
  if (req.isAuthenticated()) {
    user = req.user.displayName; 
  } else if (req.session.user) {
    user = req.session.user;
  }
  
  return res.render('layouts/all', { content: '../index.ejs', user: user });  
}

module.exports = { index };
