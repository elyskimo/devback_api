const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const passport = require("passport");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
//const { JWT_SECRET } = require('./token');
const JWT_SECRET = "mysecrettoken";
const User = require('./models/userModel');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, cb) {
        //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
        return UserModel.findOne({email, password})
           .then(user => {
               if (!user) {
                   return cb(null, false, {message: 'Incorrect email or password.'});
               }
               return cb(null, user, {message: 'Logged In Successfully'});
          })
          .catch(err => cb(err));
    }
));

passport.use(new JWTStrategy({
        // jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        jwtFromRequest: ExtractJWT.fromHeader('authorization'),
        secretOrKey   : JWT_SECRET
    },
    async (payload,done) => {
      try{
        // Find user specified in signToken
        const user = await User.findOneById(payload.sub);

        // If user doesn't exists, handle it
        if(!user){
          return done(null,false);
        }

        // Otherwise return user
        done(null,user);
      }
      catch(err){
        done(err,false);
      }
    }
    // function (jwtPayload, cb) {
    //
    //     //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
    //     return UserModel.findOneById(jwtPayload.id)
    //         .then(user => {
    //             return cb(null, user);
    //         })
    //         .catch(err => {
    //             return cb(err);
    //         });
    // }
));
