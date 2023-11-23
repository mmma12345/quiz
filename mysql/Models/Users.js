const db = require('../db');
const bcrypt = require('bcrypt');

function check(req, res, next){
  if (req.session.user || req.isAuthenticated()) {
    next();
    return true;
  } else{
    return res.redirect('/login');
  }
}

function checkForHomePage(req, res, next){
  if (req.session.user || req.isAuthenticated()) {
    return res.redirect('/games');
  } else{
    next();
  }
}

function checkForAuths(req, res, next){
  if (req.session.user || req.isAuthenticated()) {
    const referer = req.get('Referer') || '/';
    res.redirect(referer);
  } else{
    next();
  }
}

function Login(req, res){
    const { name, password } = req.body;

    const user = db.query('SELECT * FROM users WHERE name = ?', [name],(err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err});
      }
    
      if (results.length === 0) {
        return res.status(500).json({ error:'User not found'});
      }
    
      const user = results[0];
    bcrypt.compare(password, user.password, (err, passwordMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error:err});
      }
  
      if (!passwordMatch) {
        return res.status(500).json({ error:'pass wrong'});
      }

      req.session.user = user.name;
  
      return res.redirect('/games');
    });
  });
}

module.exports = {Login, check, checkForAuths, checkForHomePage}