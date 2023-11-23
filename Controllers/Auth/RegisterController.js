const db = require('../../mysql/db');
const bcrypt = require('bcrypt');
const file = require('../readFile');

  function index(req, res){
    let user;
    if (req.isAuthenticated()) {
      user = req.user.displayName;  
    } else if (req.session.user) {
      user = req.session.user;
    }
  return res.render('layouts/all', {content : '../auth/register.ejs', user: user});
  }

  function store(req, res){
    const {name , password} = req.body;
    
      // Check if the user with the same name already exists
  db.query('SELECT * FROM users WHERE name = ?', [name], (selectErr, existingUser) => {
    if (selectErr) {
      console.error(selectErr);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (existingUser.length > 0) {
      res.flash('name', 'User with the same name already exists')
      return res.redirect('/register');
    }
  // Hash the password
   bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  
    // Now, you can insert the hashed password into the "users" table
    db.query(
      'INSERT INTO users (name, password, created_at) VALUES (?, ?, NOW())',
      [name, hashedPassword],
      (insertErr, results) => {
        if (insertErr) {
          console.error(insertErr);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
  
        // Successfully inserted the data into the "users" table
        res.redirect('/login?success=Registered+successfully.+Please+Login.');
      }
    );
  });
});
  }
  
  module.exports = { index,store };