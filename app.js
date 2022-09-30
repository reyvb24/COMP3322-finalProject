var createError = require('http-errors');
var express = require('express');
var path = require('path');
var db = require('mongoose');
db.connect("mongodb+srv://root:COMP3322@musicstore.q83qo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true,
useUnifiedTopology: true}, err => {
  if (err)
    console.log("MongoDB connection error " + err);
  else
    console.log("Connected to MongoDB");
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var musicRouter = require('./routes/music');
var cartRouter = require('./routes/cart');

var app = express();
var session = require('express-session');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const loginSchema = new db.Schema({
  username: {type:String, required:true, unique:true},
  PW: {type:String, required:true},
  // carts: [{type:db.Schema.Types.ObjectId, ref: 'Cart', required: true}]
});

const cartSchema = new db.Schema({
  musicId: {type: db.Schema.Types.ObjectId, ref: 'music', required:true},
  userId: {type: db.Schema.Types.ObjectId, ref: 'login', required:true},
  quantity: {type:Number, default:0}
});

const musicSchema = new db.Schema({
  musicName: {type:String, required:true},
  category: {type:String, required:true},
  composer: {type:String, required:true},
  // image: {data:Buffer, contentType:String},
  // mp3: {data:Buffer, contentType:String},
  image: {type:String, required:true},
  mp3: {type:String, required:true},
  description: String,
  price: {type:db.Decimal128, required:true},
  published: {type:String, required:true},
  newArrival: {type:Boolean, default:false},
  // carts: [{type:db.Schema.Types.ObjectId, ref: 'Cart', required: true}]
});

const login = db.model("login", loginSchema, "Login");
const cart = db.model("cart", cartSchema, "Cart");
const music = db.model("music", musicSchema, "Music");

// pass in the database models everytime entering a url
app.use(function(req, res, next) {
  req.login = login;
  req.cart = cart;
  req.music = music;
  next();
});

app.use(session({secret:'COMP3322'}));
app.use(express.urlencoded({extended:false}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/music', musicRouter);
app.use('/cart', cartRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
