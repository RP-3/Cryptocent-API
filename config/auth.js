var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;
var signIn = require('../routes/userQueries.js').signIn;

passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:3000/console',
    realm: 'http://localhost:3000'
  },
  function(identifier, profile, done) {
    signIn(identifier, profile, done); //repeated arguments for readability
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;