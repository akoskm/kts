import mongoose from 'mongoose';
import workflowFactory from '../util/workflow';
import { logger } from '../util/logger';

const crypto = require('crypto');
const bcrypt = require('bcrypt');

export default (req, res) => {
  const workflow = workflowFactory(req, res);
  const password = req.body.pass;
  const rePassword = req.body.repass;
  const returnUnknownException = function () {
    return workflow.emit('exception', 'Unknown error occurred');
  };

  workflow.on('validatePassword', function () {
    if (!password) {
      workflow.outcome.errfor.pass = 'required';
    }
    if (!rePassword) {
      workflow.outcome.errfor.repass = 'required';
    }
    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    if (password !== rePassword) {
      workflow.outcome.errors.push('Passwords don\'t match');
      return workflow.emit('response');
    }

    return workflow.emit('hash');
  });

  workflow.on('hash', function () {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        logger.instance.error('error generating salt:', err);
        return returnUnknownException();
      }

      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          logger.instance.error('error generating hash', err);
          return returnUnknownException();
        }
        workflow.hash = hash;
        return workflow.emit('activateUser');
      });
    });
  });

  workflow.on('activateUser', function () {
    mongoose.model('User').findOneAndUpdate({
      token: req.body.token,
      password: req.body.token,
      status: 'PENDING'
    }, {
      password: workflow.hash,
      status: 'ACTIVE',
      token: null
    }, function (err, user) {
      if (err) {
        logger.instance.error('error during settings active flag and password', err);
        workflow.outcome.errors.push('User activation failed');
        return workflow.emit('response');
      }
      if (!user) {
        workflow.outcome.errors.push('User is already active');
        return workflow.emit('response');
      }
      workflow.outcome.result = 'User activation successful';
      return workflow.emit('response');
    });
  });

  workflow.emit('validatePassword');
};
