let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
let logger = require('morgan');
var passport = require('passport');
require('./passport');
const auth = require('./users-routes');


let app = express();
// app.set('secretKey', 'nodeRestApi'); // jwt secret token
let apiRoutes = require("./api-routes");
let usersRoutes = require("./users-routes");
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
// Connect to Mongoose and set connection variable
mongoose.connect('mongodb://localhost/resthub', { useNewUrlParser: true});
var db = mongoose.connection;

// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// Setup server port
var port = process.env.PORT || 8080;

// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express'));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
// Use Api routes in the App
app.use('/api', validateUser, apiRoutes);
app.use('/users',usersRoutes);
app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

function validateUser(req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
      if (err) {
        res.json({status:"error", message: err.message, data:null});
      }else{
        // add user id to request
        req.body.userId = decoded.id;
        next();
      }
})
};

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function(req, res, next) {
    let err = new Error('Not Found');
       err.status = 404;
       next(err);
});
// handle errors
app.use(function(err, req, res, next) {
console.log(err);

    if(err.status === 404)
    res.status(404).json({message: "Not found"});
    else
    res.status(500).json({message: "Something looks wrong :( !!!"});
});
// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running RestHub on port " + port);
});
