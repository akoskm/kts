import { logger } from '../util/logger';

import sendmail from '../util/sendmail';
import mongoose from 'mongoose';

const crypto = require('crypto');

function createUser(req, res, token) {
  const params = {
    username: req.body.email,
    email: req.body.email,
    password: token,
    status: 'PENDING',
    token: token
  };
  const createUser = mongoose.model('User').create(params);
  createUser.then(() => {
    sendmail(req, res, {
      from: req.app.config.smtp.from.name + ' <' + req.app.config.smtp.from.address + '>',
      to: req.body.email,
      subject: 'Sign Up to ' + req.app.config.projectName,
      textPath: './signup/email-text',
      htmlPath: './signup/email-html',
      locals: {
        username: req.body.email,
        link: req.protocol + '://' + req.headers.host + '/activation/' + token + '/',
        projectName: req.app.config.projectName
      },
      success(message) {
        logger.instance.info(message);
        res.send({
          success: true, message: 'Request sent, check your Inbox!'
        });
      },
      error(err) {
        logger.instance.error(err);
        res.send({
          success: true, message: 'Failed to send signup email'
        });
      }
    });
  });
}

export default (req, res) => {
  const params = { username: req.body.email };
  const lookup = mongoose.model('User').findOne(params).exec();
  lookup.then(user => {
    if (user) {
      throw 'Email is already taken';
    } else {
      crypto.randomBytes(21, function (err, buf) {
        if (err) {
          logger.instance.error('Error generating random bytes:', err);
        }

        let token = buf.toString('hex');
        if (!token) {
          throw 'Failed to generate token';
        }
        createUser(req, res, token);
      });
    }
  }).catch((err) => {
    res.send({
      success: true, message: err
    });
  });
};
