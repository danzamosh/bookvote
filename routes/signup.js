var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

/* POST signup. */
router.post('/', function(req, res) {
  var db = req.db;
  db.one('SELECT id FROM users WHERE username=$1', [req.body.username])
    .then(() => {
      res.render('signup', { error: true});
    })
    .catch(error => {
      bcrypt.hash(req.body.password, 10, function(err, hash) {
        db.none('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [req.body.username, hash, req.body.email])
          .then(() => {
            db.one('SELECT id FROM users WHERE username=$1', [req.body.username])
              .then(function(data) {
              req.session.userid = data.id;
              req.session.user = req.body.username;
              res.redirect("/");
            });
          })
          .catch(error => {
            res.end('There was an error adding the user.');
          });
      });
    });
});


/* GET signup. */
router.get('/', function(req, res, next) {
  res.render('signup');
});

module.exports = router;
