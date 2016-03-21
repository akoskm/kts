const crypto = require('crypto');
const bcrypt = require('bcrypt');

export default (req, res) => {

  let password = req.body.pass;
  let rePassword = req.body.repass;

  if (!password || !rePassword) {
    res.status(200).json({
      success: false, message: 'Password is required'
    });
  } else if (password !== rePassword) {
    res.status(200).json({
      success: false, message: 'Passwords don\'t match'
    });
  } else {
    let token = req.app.schema.token.find({
      attributes: ['account_id'],
      where: {
        token_string: req.body.token
      }
    }).then(function (result) {
      if (!result) {
        res.status(200).json({
          success: false, message: 'Invalid activation token'
        });
      } else {
        req.app.schema.user.find({
          where: {
            id: result.get('account_id'),
            status: 'PENDING'
          }
        }).then(function (result) {
          if (!result) {
            res.status(200).json({
              success: false, message: 'Invalid account'
            });
          } else {
            /**
             * activation token valid, account exists, set password and activate
             */
            bcrypt.genSalt(10, function (err, salt) {
              if (err) {
                req.app.logger.err('error generating salt:', err);
              }

              bcrypt.hash(password, salt, function (err, hash) {
                if (err) {
                  req.app.logger.err('error generating hash', err);
                }

                return req.app.db.transaction(function (t) {
                  return req.app.schema.user.update(
                    {
                      status: 'ACTIVE',
                      password: hash
                    }, {
                      where: {
                        id: result.get('id')
                      }
                    }, {
                      transaction: t
                    }
                  ).then(function (user) {
                    return req.app.schema.token.destroy(
                      {
                        where: {
                          token_string: req.body.token,
                          account_id: result.get('id')
                        }
                      }, {
                        transaction: t
                      }
                    );
                  });
                }).then(function (result) {
                  req.app.logger.info(result);
                  res.status(200).json({
                    success: true, message: 'Activated'
                  });
                }).catch(function (err) {
                  req.app.logger.error(result);
                  res.status(200).json({
                    success: false, message: 'Activation failed'
                  });
                });
              });
            });
          }
        });
      }
    });
  }
};
