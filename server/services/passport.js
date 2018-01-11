const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const User = require('../models/user');
const config = require('../config');

/* --------- Local Strategy --------- */

// Options for local strategy
const localOptions = {
  usernameField: 'email', // use email field for authentication
};

// Create local strategy with email and password
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // verify email and password
  User.findOne({ email }, (err, user) => {
    if (err) return done(err);

    // if it is incorrect email and password and no user exist, call done with false
    if (!user) return done(null, false);

    // compare passwords using schema's method: is passed password is equal to user's password
    user.comparePassword(password, (err, isMatch) => {
      if (err) return done(err);
      if (!isMatch) return done(null, false);

      // if provided data is valid (passwords match), call done with the user object
      return done (null, user);
    });
  });
});



/* --------- JWT Strategy --------- */

// Options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'), // extract jwt from authorization header
  secretOrKey: config.secret
};

// Create JWT strategy, JwtStrategy constructor takes two args: configuration and callback with 2 args:
// 1) payload - argument is a decoded jwt configuration object (with sub and iat props)
// 2) done - done function handles success or failure, adds user to request object as a 'req.user' prop

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // see if the user id in the payload exists in database. if so, call done with that user
  User.findById(payload.sub, (err, user) => {
    if (err) return done(err, false);
    if (user) return done(null, user);

    // otherwise, call done without a user object
    done(null, false);
  })
});

// Tell passport to use created strategies
passport.use(jwtLogin);
passport.use(localLogin);