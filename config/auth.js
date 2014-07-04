var passport = require('passport');
var GoogleStrategy = require('passport-google').Strategy;

passport.use(new GoogleStrategy({
    returnURL: 'http://localhost:3000/console',
    realm: 'http://localhost:3000'
  },
  function(identifier, profile, done) {
    User.findOrCreate({ openId: identifier }, function(err, user) {
      done(err, user);
    });
  }
));

module.exports = passport;