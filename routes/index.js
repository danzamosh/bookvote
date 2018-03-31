var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  var db = req.db;
  var bookid = req.body.id;
  var userid = req.session.userid;
  var visited = req.body.visited;
  var score = req.body.score;
  if(visited != 'true') {
    db.none('SELECT * FROM upvotes WHERE bookid=$1 AND userid=$2', [bookid, userid])
      .then(() => {
        db.none('UPDATE books SET score=$1 WHERE id=$2', [score, bookid])
          .then(() => {
            db.none('INSERT INTO upvotes (userid, bookid) VALUES ($1, $2)', [userid, bookid])
            .then(() => {
              res.end("Score updated");
            });
          })
          .catch(error => {
              // error;
          });
      })
      .catch(error => {

      });
  } else {
    db.one('SELECT id FROM upvotes WHERE bookid=$1 AND userid=$2', [bookid, userid])
      .then(function(data) {
        db.none('UPDATE books SET score=$1 WHERE id=$2', [score, bookid])
          .then(() => {
            db.none('DELETE FROM upvotes WHERE id=$1', [data.id])
            .then(() => {
              res.end("Score updated");
            })
            .catch(error => {
            });
          });
      })
      .catch(error => {
      });
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;
  var loggedin;
  if(req.session.user) {
    loggedin = true;
  } else {
    loggedin = false;
  }
  var userid = req.session.userid;
  db.any('SELECT * FROM books ORDER BY score DESC', [true])
      .then(function(books) {
        db.any('SELECT * FROM upvotes WHERE userid=$1', [userid])
          .then(function(data) {
            res.render('index', { books: books, loggedin: loggedin, upvoted: data });
          })
          .catch(function(error) {
            console.log(error)
            res.end("Could not load page!");
          });
      })
      .catch(function(error) {
        res.end("Could not load page!!");
      });
});

module.exports = router;
