import Sequelize from 'sequelize';
import sendmail from '../util/sendmail';

const crypto = require('crypto');

export default (req, res) => {
  crypto.randomBytes(21, function (err, buf) {
    if (err) {
      req.app.logger.err('Error generating random bytes:', err);
    }

    let token = buf.toString('hex');

    return req.app.db.transaction(function (t) {

      return req.app.schema.user.create({
        username: req.body.email,
        email: req.body.email,
        password: token,
        status: 'PENDING'
      }, { transaction: t }).then(function (user) {
        return req.app.schema.token.create({
          account_id: user.get('id'),
          token_string: token
        }, { transaction: t });
      }).then(function (result) {
        req.app.logger.info('New signup request! Email sent to', req.body.email);

        sendmail(req, res, {
          from: req.app.config.smtp.from.name + ' <' + req.app.config.smtp.from.address + '>',
          to: req.body.email,
          subject: 'Sign Up to ' + req.app.config.projectName,
          textPath: 'signup/email-text',
          htmlPath: 'signup/email-html',
          locals: {
            username: req.body.email,
            link: req.protocol + '://' + req.headers.host + '/activation/' + token + '/',
            projectName: req.app.config.projectName
          },
          success(message) {
            req.app.logger.info(message);
          },
          error(err) {
            req.app.logger.error(err);
          }
        });

        res.status(200).json({
          success: true, message: 'Request sent, check your Inbox!'
        });
      }).catch(function (err) {
        req.app.logger.error('Signup request rolled back, cause:', err);

        let emailInUse = false;

        if (err.name === 'SequelizeUniqueConstraintError') {
          let email = err.errors.filter(function (e) {
            if (e.path === 'email') {
              return e;
            }
          });
          if (email.length > 0) {
            res.status(200).json({
              success: false, message: 'Email ' + email[0].value + ' is already in use'
            });
            emailInUse = true;
          }
        }

        // unknown error
        if (!emailInUse) {
          res.status(200).json({
            success: false, message: 'Ooops, something went wrong'
          });
        }
      });
    });
  });
};
