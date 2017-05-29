const options = {
  secretOrKey: config.jwtSecret,
  jwtFromRequest: (req) => {
    if (req.headers["authorization"]) {
      return req.headers["authorization"];
    }
    return null;
  }
};
import models from '../../models/';
import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import config from '../config';

const Users = models.Users;

const strategy = new Strategy(options, (payload, done) => {
  console.log('strategizing');  
  Users.findOne({
    where: { email: payload.email }
  })
    .then(user => {
      console.log(user);
      if (user) {
        return done(null, user);
      }
      return done(new Error('User not found'), false);
    })
    .catch(error => {
      console.log(error);
      done(error, null)
    });
});


passport.use(strategy);

export default passport;