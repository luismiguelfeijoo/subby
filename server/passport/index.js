const passport = require('passport');
const LocalUser = require('../models/LocalUser');
const ClientUser = require('../models/ClientUser');

// REQUIRE ALL STRATEGIES HERE!!!
require('./strategies/local');

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  LocalUser.findById(id)
    .then(user => {
      if (user) {
        cb(null, user);
      } else {
        ClientUser.findById(id)
          .then(user => cb(null, user))
          .catch(e => cb(err));
      }
    })
    .catch(e => cb(err));
});

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());
};
