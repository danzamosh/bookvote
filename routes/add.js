var express = require('express');
var router = express.Router();
const PriceFinder = require('price-finder');
const priceFinder = new PriceFinder();

/* POST add. */
router.post('/', function(req, res) {
  var db = req.db;
  var title = req.body.title;
  var author = req.body.author;
  var image = req.body.image;
  var amazon = req.body.amazon;
  var goodreads = req.body.goodreads;
  priceFinder.findItemDetails(amazon, function(err, itemDetails) {
    if(err!=null) {
      res.render('add', { error: true });
    } else {
      db.none('INSERT INTO books (title, author, image, amazon_link, goodreads_link) VALUES ($1, $2, $3, $4, $5)', [title, author, image, amazon, goodreads])
        .then(() => {
          res.redirect("/");
        })
        .catch(error => {
          res.end('There was an error adding the book.');
        });
    }
  });
});


/* GET add. */
router.get('/', function(req, res, next) {
  if(req.session.user) {
    res.render('add');
  } else {
    var string = encodeURIComponent('add');
    res.redirect("/login")
  }
});

module.exports = router;
