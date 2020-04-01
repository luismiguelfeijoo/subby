const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const LocalUser = require('../../models/LocalUser');
const ClientUser = require('../../models/ClientUser');
const { checkHashed } = require('../../lib/hashing');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      if (username === '' || password === '') {
        done(null, false);
      }
      const foundUserLocal = await LocalUser.findOne({ username });
      if (foundUserLocal) {
        checkHashed(password, foundUserLocal.password)
          ? done(null, foundUserLocal)
          : done(null, false);
      } else {
        const foundUserClient = await ClientUser.findOne({ username });
        if (foundUserClient) {
          checkHashed(password, foundUserClient.password)
            ? done(null, foundUserClient)
            : done(null, false);
        } else {
          done(null, false);
        }
      }
    } catch (error) {
      done(error);
    }
  })
);
