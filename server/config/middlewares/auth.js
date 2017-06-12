import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import models from '../../models/';
import config from './config';

const options = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: (req) => {
    if (req.headers['authorization']) {  //eslint-disable-line
      return req.headers['authorization']; //eslint-disable-line
    }
    return null;
  }
};


const Users = models.Users;

const strategy = new Strategy(options, (payload, done) => {
  Users.findOne({
    where: { email: payload.email }
  })
    .then(user => {
      if (user) {
        return done(null, user);
      }
      return done(new Error('User not found'), false);
    })
    .catch(error => {
      done(error, null);
    });
});


passport.use(strategy);

export default passport;
