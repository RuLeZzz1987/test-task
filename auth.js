"use strict";

const config = require('config');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');

const opts = {
  secretOrKey: config.get('jwtSecret'),
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('jwt'),
  ignoreExpiration: false
};


passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
  console.log(jwt_payload);
  done(null, { ok: 1 });
}));

module.exports = passport;
