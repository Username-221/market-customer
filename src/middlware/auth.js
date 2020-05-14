const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { auth } = require('../../config');

const jwtStrategy = new Strategy({
  secretOrKey: auth.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}, (user, done) => done(null, user));

module.exports = passport.use(jwtStrategy);
