"use strict";

const config = require('config');
const { Strategy:JwtStrategy, ExtractJwt } = require('passport-jwt');

const opts = {
  secretOrKey: config.get('jwtSecret'),
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
  ignoreExpiration: false
};

module.exports = function (app, passport) {

  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {

  done(null, {ok :1});
  }));

  app.use(passport.initialize());

};
