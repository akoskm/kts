const bcrypt = require('bcrypt');

export default class {

  constructor(schema) {
    this.schema = schema;
  }

  get authenticate() {
    return (username, password, done) => {
      this.schema.user.find({
        where: {
          email: username
        }
      }).then(function (user) {
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password.' });
        } else {
          bcrypt.compare(password, user.get('password'), function (err, result) {
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
