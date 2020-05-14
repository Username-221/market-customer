const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { auth } = require('../../config');

const jwtStrategy = new Strategy({
  secretOrKey: auth.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
}, (user, done) => done(null, user));

const jwtWithExpirationStrategy = new Strategy({
  secretOrKey: auth.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: true,
}, (user, done) => done(null, user));

passport.use(jwtStrategy);
passport.use('jwte', jwtWithExpirationStrategy);

module.exports = passport;
