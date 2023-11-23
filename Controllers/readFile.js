const fs = require('fs');

function view(req, res, name, datas){
fs.readFile(name, 'utf8', (err, content) => {
    if (err) {
      console.error(err);
      return err;
    }
    const user = req.session.user;
    return res.render('layouts/all', {content: content, datas: datas, user: user});
  });
}

module.exports = {view};