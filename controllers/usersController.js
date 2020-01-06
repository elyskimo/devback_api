const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
// const { JWT_SECRET } = require('./token');
const JWT_SECRET = "mysecrettoken";
signToken = user => {
  return jwt.sign({
    iss: "restful api",
    sub: user.id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)
  }, JWT_SECRET);
}

module.exports = {
 create: function(req, res, next) {

  userModel.create({ email: req.body.email, password: req.body.password }, function (err, result) {
      if (err)
       next(err);
      else
       res.json({status: "success", message: "User added successfully!!!", data: null});

    });
 },
authenticate: function(req, res, next) {
  userModel.findOne({email:req.body.email}, function(err, userInfo){
     if (err) {
      next(err);
     } else {
if(bcrypt.compareSync(req.body.password, userInfo.password)) {
const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), { expiresIn: '1h' });
res.json({status:"success", message: "user found!!!", data:{user: userInfo, token:token}});
}else{
res.json({status:"error", message: "Invalid email/password!!!", data:null});
}
     }
    });
 },
 login: function (req, res, next) {
     passport.authenticate('local', {session: false}, (err, user, info) => {
         if (err || !user) {
             return res.status(400).json({
                 message: 'Something is not right',
                 user   : user
             });
         }
        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const token = jwt.sign(user, 'your_jwt_secret');
            return res.json({user, token});
         });
     })(req, res);
 },
 signup: async (req, res, next) => {
   const { email, password } = req.value.body;
   const foundUser = await User.findOne({ email });
   if(foundUser){
     return res.status(403).json({ error: "Email already in use"});
   }

   const newUser = new User({ email, password });
   await newUser.save();

   const token = signToken(newUser);
   res.status(200).json({ token });
 },
 secret: async (req,res,next) => {
   console.log("SECRET!");
 },
}
