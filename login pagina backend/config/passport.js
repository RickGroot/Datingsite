const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Inladen van de variabele "user"
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      //kijken of email klopt
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'De email bestaat niet' });
        }

        // kijken of wachtwoord klopt
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Wachtwoord is fout' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
