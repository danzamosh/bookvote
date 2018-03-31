var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

/* POST login. */
router.post('/', function(req, res) {
  var db = req.db;
  db.one('SELECT id,password FROM users WHERE username=$1', [req.body.username])
    .then(function(data) {
      bcrypt.compare(req.body.password, data.password, function(err, pas) {
        if(pas) {
          req.session.userid = data.id;
          req.session.user = req.body.username;
          res.redirect("/");
        } else {
          res.render('login', { error: true});
        }
      });
    })
    .catch(error => {
      res.render('login', { error: true});
    });
});


/* GET login. */
router.get('/', function(req, res, next) {
  res.render('login');
});

module.exports = router;
