import sendmail from '../util/sendmail';
import workflow from '../util/workflow';
import mongoose from 'mongoose';

const crypto = require('crypto');

export default (req, res) => {
  const wf = workflow(req, res);

  wf.on('checkEmail', function () {
    mongoose.model('User').findOne({
      username: req.body.email
    }, function (err, user) {
      if (err) {
        req.app.logger.error('Cannot lookup email', err);
      }
      if (user) {
        wf.outcome.errors.push('Email is already taken');
        return wf.emit('response');
      }
      return wf.emit('createToken');
    });
  });

  wf.on('createToken', function () {
    crypto.randomBytes(21, function (err, buf) {
      if (err) {
        req.app.logger.error('Error generating random bytes:', err);
      }

      let token = buf.toString('hex');
      if (!token) {
        wf.outcome.errors.push('Failed to generate token');
      }
      wf.token = token;
      return wf.emit('createUser');
    });
  });

  wf.on('createUser', function () {
    mongoose.model('User').create({
      username: req.body.email,
      email: req.body.email,
      password: wf.token,
      status: 'PENDING'
    }, function (err, user) {
      if (err) {
        req.app.logger.error('Error while creating user', err);
        wf.outcome.errors.push('Unable to create User');
      }

      if (wf.hasErrors()) {
        return wf.emit('response');
      }

      wf.user = user;
      return wf.emit('sendActivationEmail');
    });
  });

  wf.on('sendActivationEmail', function () {
    mongoose.model('Token').create({
      user: wf.user,
      tokenString: wf.token
    }, function (err, token) {
      req.app.logger.info('New signup request! Email sent to', req.body.email);

      if (err) {
        req.app.logger.error('Failed to create Token', err);
        wf.outcome.errors.push('Unable to send verification token');
        return wf.emit('response');
      }

      if (!token) {
        req.app.logger.error('Failed to create Token. Token is empty', token);
        wf.outcome.errors.push('Unable to create verification token');
        return wf.emit('response');
      }

      sendmail(req, res, {
        from: req.app.config.smtp.from.name + ' <' + req.app.config.smtp.from.address + '>',
        to: req.body.email,
        subject: 'Sign Up to ' + req.app.config.projectName,
        textPath: 'signup/email-text',
        htmlPath: 'signup/email-html',
        locals: {
          username: req.body.email,
          link: req.protocol + '://' + req.headers.host + '/activation/' + token.tokenString + '/',
          projectName: req.app.config.projectName
        },
        success(message) {
          req.app.logger.info(message);
          wf.outcome.result = {
            success: true, message: 'Request sent, check your Inbox!'
          };
          return wf.emit('response');
        },
        error(err) {
          req.app.logger.error(err);
          wf.outcome.errors.push('Failed to send signup email');
          return wf.emit('response');
        }
      });
    });
  });

  wf.emit('checkEmail');
};
