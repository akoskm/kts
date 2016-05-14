import { logger } from '../util/logger';

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
        logger.instance.error('Cannot lookup email', err);
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
        logger.instance.error('Error generating random bytes:', err);
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
      status: 'PENDING',
      token: wf.token
    }, function (err, user) {
      if (err) {
        logger.instance.error('Error while creating user', err);
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
    sendmail(req, res, {
      from: req.app.config.smtp.from.name + ' <' + req.app.config.smtp.from.address + '>',
      to: req.body.email,
      subject: 'Sign Up to ' + req.app.config.projectName,
      textPath: './signup/email-text',
      htmlPath: './signup/email-html',
      locals: {
        username: req.body.email,
        link: req.protocol + '://' + req.headers.host + '/activation/' + wf.token + '/',
        projectName: req.app.config.projectName
      },
      success(message) {
        logger.instance.info(message);
        wf.outcome.result = {
          success: true, message: 'Request sent, check your Inbox!'
        };
        return wf.emit('response');
      },
      error(err) {
        logger.instance.error(err);
        wf.outcome.errors.push('Failed to send signup email');
        return wf.emit('response');
      }
    });
  });

  wf.emit('checkEmail');
};
