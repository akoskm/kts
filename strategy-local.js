import mongoose from 'mongoose';

const bcrypt = require('bcrypt');

export default class {

  get authenticate() {
    return (username, password, done) => {
      mongoose.model('User').findOne({
        email: username
      }, function (err, user) {
        if (err) {
          return done(err, null);
        }
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password.' });
        } else {
          bcrypt.compare(password, user.password, function (err, result) {
            if (!result) {
              return done(null, false, { message: 'Incorrect email or password.' });
            } else {
              return done(null, user.toJSON());
            }
          });
        }
      });
    };
  }
}
