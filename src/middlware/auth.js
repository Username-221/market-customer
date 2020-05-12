const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { auth } = require('../../config');

const jwtStrategy = new Strategy({
  secretOrKey: auth.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}, ({ user, restore }, done) => done(null, user || restore));

module.exports = passport.use(jwtStrategy);
