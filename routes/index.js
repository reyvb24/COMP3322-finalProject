var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('index', { title: 'HK Music Shop - Login', error: req.query.error });
});

router.post('/login', function( req, res, next) {
  let findUser = req.login.findOne({username: req.body.username, PW:req.body.password}, {PW:0}, (err, docs) => {
    if (err==null) {
      if (!docs) {
        let status = encodeURIComponent("Invalid login, please login again.");
        let url = encodeURIComponent('/login');
        res.redirect('/status/?message='+status+'&url='+url);
      } else {
        req.session.username = req.body.username;
        req.session.userId = docs._id;
        let tempCart = req.session.cart;
        if (tempCart) {
          console.log('TEMPCART:',tempCart);
          for (let cart of tempCart) {
            cart.userId = req.session.userId;
            delete cart._id;
          }
          let index = 0;
          const updateCart = async(tempCart) => {
            try {
              for (let item of tempCart) {
                console.log(item);
                let result = await req.cart.findOneAndUpdate({userId: req.session.userId, musicId: item.musicId._id}, {$inc:{quantity:parseInt(item.quantity)}});
                if (!result) {
                  let newCart = new req.cart({
                    userId: req.session.userId,
                    musicId: item.musicId._id, 
                    quantity: parseInt(item.quantity)
                  });
                  newCart.save();
                }
              }
              
            } catch(err) {
              res.redirect('/');
            }
          };
          updateCart(tempCart).then(_ => {
            console.log('DONE');
            req.session.cart = [];
            res.redirect('/');
          });
        } else {
          res.redirect('/');
        }
        
      }
    } else {
      let status = encodeURIComponent("Invalid login, please login again.");
      let url = encodeURIComponent('/login');
      res.redirect('/status/?message='+status+'&url='+url);
    }
  });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', {title: 'HK Music Shop - Sign Up', error:req.query.error});
});

router.post('/signup', function(req, res, next) {
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
            let status = encodeURIComponent("Error creating new user");
            let url = encodeURIComponent('/signup');
            res.redirect('/status/?message='+status+'&url='+url);
          } else {
            console.log(result);
            let status = encodeURIComponent("Account created! Welcome");
            let url = encodeURIComponent('/login');
            res.redirect('/status/?message='+status+'&url='+url);
          }
        });
      } else {
        let status = encodeURIComponent("Account already existed");
        let url = encodeURIComponent('/signup');
        res.redirect('/status/?message='+status+'&url='+url);
      }
    } else {
      let status = encodeURIComponent(err);
      let url = encodeURIComponent('/signup');
      res.redirect('/status/?message='+status+'&url='+url);
    }
  });
});

router.get('/status', function(req, res, next) {
  res.render('routingStatus', {status: req.query.message, url:req.query.url});
});

router.get('/logout', function(req, res, next) {
  req.session.destroy((err) => {
    if (err) {
      console.log("Cannot access session", err);
    }
  });
  let status = encodeURIComponent('Logging Out');
  let url = encodeURIComponent('/');
  res.redirect('/status/?message='+status+'&url='+url);
});


router.get('/cart', function(req, res, next) {
  if (req.session.username) {
    req.login.findOne({username: req.session.username}, {_id:1}, (err, result) => {
      if (err===null) {
        res.render('cart', { title: 'Cart', loggedIn:req.session.username, userId:result._id});
      }
    });
  } else {
    res.render('cart', {title: 'Cart'});
  }
});

router.get('/checkout', function(req, res, next) {
  if (req.session.username) {
    req.cart.findOne({userId: req.session.userId}, {_id:1}, (err, result) => {
      if (err===null) {
        console.log(result);
        if (result) {
          res.render('checkout', { title: 'Checkout', loggedIn:req.session.username, userId:result._id});
        } else {
          let status = encodeURIComponent("Cart is not filled yet");
          let url = encodeURIComponent('/');
          res.redirect('/status/?message='+status+'&url='+url);
        }
      }
    });
  } else {
    if (!req.session.cart) {
      let status = encodeURIComponent("Cart is not filled yet");
      let url = encodeURIComponent('/');
      res.redirect('/status/?message='+status+'&url='+url);
    } else {
      if (req.session.cart.length===0) {
        let status = encodeURIComponent("Cart is not filled yet");
        let url = encodeURIComponent('/');
        res.redirect('/status/?message='+status+'&url='+url);
      }
      res.render('checkout', {title: 'Checkout'});
    }
  }
});

router.post('/invoice', function(req, res, next) {
  console.log(req.body);
  // console.log(JSON.parse(req.body.carts));
  const data = req.body;
  req.session.cart = [];
  res.render('invoice', {data: data, loggedIn:req.session.username, userId:req.session.userId});
});

router.get('/', function(req, res, next) {
  console.log(req.session);
  const categories = req.music.distinct('category', function(err, result) {
    if (err===null) {
      // res.send({msg:"tikbai"})
      console.log(req.session.username);
      console.log(req.session.userId);
      res.render('home', { title: 'Home Page', loggedIn:req.session.username, categories: result, userId:req.session.userId, isHome:true });
    } else {
      res.send({msg: err});
    }
  });
});

router.post('/', function(req, res, next) {
  const categories = req.music.distinct('category', function(err, result) {
    if (err===null) {
      // res.send({msg:"tikbai"})
      console.log(req.session.username);
      console.log(req.session.userId);
      res.render('home', { title: 'Home Page', loggedIn:req.session.username, categories: result, userId:req.session.userId, isHome:true, keywords:req.body.keywords});
    } else {
      res.send({msg: err});
    }
  });
});

router.get('/:category', function(req, res, next) {
  console.log(req.params);
  const categories = req.music.distinct('category', function(err, result) {
    if (err===null) {
      res.render('home', { title: 'Home Page', loggedIn:req.session.username, categories: result, selectedCategory:req.params.category });
    } else {
      res.send({msg: err});
    }
  });
});

router.get('/info/:id', function(req, res, next) {
  console.log(req.params.id);
  req.music.findOne({_id: req.params.id}, (err,docs) => {
    console.log(docs);
    if (err===null) {
      if (req.session.username) {
        res.render('info', {title: 'INFO', musicInfo: docs, loggedIn: req.session.username, userId: req.session.userId});
      } else {
        res.render('info', {title: 'INFO', musicInfo: docs});
      }      
    } else {
      res.send({msg: err});
    }
  });
});

router.post('/info/:id', function(req, res, next) {
  console.log(req.body);
  if (req.session.username) {
    req.cart.findOne({musicId: req.body.musicId, userId:req.params.id}, (err, doc) => {
      if (err) {
        res.send({msg: err, success:false});
      }
      if (doc) {
        req.cart.findOneAndUpdate({musicId: req.body.musicId, userId:req.params.id}, {quantity: doc.quantity+parseInt(req.body.quantity)}, (err, result) => {
          if (err===null) {
            res.send({msg: "Successfully updated cart", success:true});
          } else {
            res.send({msg: err, success:false});
          }
        });
      } else {
        const newCart = new req.cart({
          musicId: req.body.musicId,
          userId: req.params.id,
          quantity: req.body.quantity
        });
      
        newCart.save((err, result) => {
          if (err===null) {
            res.send({msg: "Successfully updated cart", success:true});
          } else {
            res.send({msg: err, success:false});
          }
        });
      }
    });
  } else {
    req.music.findOne({_id: req.body.musicId}, (err, music) => {
      if (req.session.cart) {
        let isPresent = false;
        for (let cart of req.session.cart) {
          // console.log(cart.musicId._id, req.body.musicId);
          // console.log(cart.musicId._id===req.body.musicId);
          if (cart.musicId._id===req.body.musicId) {
            isPresent = true;
            cart.quantity+=parseInt(req.body.quantity);
            res.send({msg: "Successfully updated cart", success:true});
          }
        }
        if (!isPresent) {
          req.session.cart.push({
            _id: req.session.cart.length,
            musicId: music,
            quantity: parseInt(req.body.quantity)
          });
          res.send({msg: "Successfully updated cart", success:true});
        }
      } else {
        req.session.cart = [{
          _id: 0,
          musicId: music,
          quantity: parseInt(req.body.quantity)
        }];
        res.send({msg: "Successfully updated cart", success:true});
      }
    });
  }
});

module.exports = router;
