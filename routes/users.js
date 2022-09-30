var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/invoice/:username', function(req, res, next) {
  console.log(req.params.username);
  req.login.findOne({username: req.params.username}, {PW:0}, (err, user) => {
    if (!err) {
      res.send({data: user});
    } else {
      res.send({data: err});
    }
  });
});

router.post('/create', function(req, res, next) {
    let findUser = req.login.find({username: req.body.username}, {username:1}, (err, docs) => {
      if (err==null) {
        if (docs.length===0) {
          console.log(req.body);
          let newUser = new req.login({
            username: req.body.username,
            PW: req.body.password
          });
          newUser.save(function(err, result) {
            if (err) {
              res.send({msg: err});
            } else {
              res.send({msg: result});
            }
          });
      }
    }
  });
});

router.post('/signup', function(req, res, next) {
  console.log(req.login);
  let findUser = req.login.find({username: req.body.username}).count();
  if (findUser) {
    console.log("user found");
    res.render('signup', {title: "Sign Up"});
  }
  console.log("Logged in");
  console.log(req.body);
  res.redirect('/');
});

router.post('/login', (req, res) => {
  console.log("Logged in");
  console.log(req.body);
  res.send({msg:req.body});
});

// insert new data here
router.get('/upload', (req, res) => {
  res.render('uploadFiles');
});

router.post('/upload', (req, res) => {
  console.log(req.body);
  const params = req.body;
  const uploadFiles = new req.music({
    musicName: params.musicName,
    category: params.category,
    composer: params.composer,
    image: params.image,
    mp3: params.mp3,
    description: params.description,
    price: params.price,
    published: params.date,
    newArrival: params.newArrival==="True"?true:false
  });

  uploadFiles.save(function(err, result) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect(req.originalUrl);
});

module.exports = router;
