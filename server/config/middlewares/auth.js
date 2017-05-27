import models from '../../models/';
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import config from '../config';

const options = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: (req) => {
    if (req.headers["authorization"]) {
      return req.headers["authorization"];
    }
    return null;
  }
};

const User = models.User;

const strategy = new Strategy(options, (payload, done) => {
  User.findOne({
    where: { email: payload.email }
  })
    .then(user => {
      if (user) {
        return done(null, user);
      }
      return done(new Error('User not found'), false);
    })
    .catch(error => done(error, null));
});


passport.use(strategy);

export default passport;
