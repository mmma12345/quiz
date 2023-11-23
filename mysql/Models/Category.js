const db = require('../db');

function find(id, callback){
        db.query('SELECT * FROM categories WHERE id = ?', [id], (err, datas) => {
          if (err) {
            console.error(err);
            return callback(err, null);
          }

          callback(null, datas);
        });
}

module.exports = { find }