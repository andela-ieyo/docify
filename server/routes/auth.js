// auth.js
import passport from 'passport'; 
import {Strategy, ExtractJwt } from 'passport-jwt';   
var users = require("./users.js");  
var cfg = require("./config.js");  
var params = {  
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
};

module.exports = function() {  
    var strategy = new Strategy(params, function(payload, done) {
        var user = users[payload.id] || null;
        if (user) {
            return done(null, {
                id: user.id
            });
        } else {
            return done(new Error("User not found"), null);
        }
    });
    passport.use(strategy);
    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", cfg.jwtSession);
        }
    };
};


module.exports = app => {
  const Users = app.db.models.Users;
  const cfg = app.libs.config;
  const params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
  };
  const strategy = new Strategy(params, (payload, done) => {
      Users.findById(payload.id)
52
.then(user => {
               if (user) {
                 return done(null, {
                   id: user.id,
                   email: user.email
});
               return done(null, false);
             })
              .catch(error => done(error, null));
         });
         initialize: () => {
           return passport.initialize();
         },
         authenticate: () => {
           return passport.authenticate("jwt", cfg.jwtSession);
   }
32 };
33 };