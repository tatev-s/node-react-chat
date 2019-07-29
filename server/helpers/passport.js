import passport from 'passport';
import { Strategy } from 'passport-local'
import model from '../models';

const { User } = model;

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findByPk(id).then((user) => {
    done(null, user.dataValues);
  })
});

passport.use('local',new Strategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    User.findOne({
      where: {email: username},
    }).then(user => {
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    }).catch(error => {
      return done(null, false, { message: 'Incorrect username.' });
    })

  }
));
export default passport;
