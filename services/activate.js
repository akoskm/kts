import mongoose from 'mongoose';
import workflowFactory from '../util/workflow';

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

    return workflow.emit('findToken');
  });

  workflow.on('findToken', function () {
    mongoose.model('Token').findOne({
      tokenString: req.body.token
    }).populate('user').exec(function (err, token) {
      if (err) {
        req.app.logger.error('Cannot lookup token', err);
      }
      if (!token) {
        workflow.outcome.errors.push('Token not found');
      }
      if (workflow.hasErrors()) {
        return workflow.emit('response');
      }
      workflow.token = token;
      return workflow.emit('hash');
    });
  });

  workflow.on('hash', function () {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        req.app.logger.error('error generating salt:', err);
        return returnUnknownException();
      }

      bcrypt.hash(password, salt, function (err, hash) {
        if (err) {
          req.app.logger.error('error generating hash', err);
          return returnUnknownException();
        }
        workflow.hash = hash;
        return workflow.emit('activateUser');
      });
    });
  });

  workflow.on('activateUser', function () {
    let userId = workflow.token.user._id;
    mongoose.model('User').findOneAndUpdate({
      _id: userId,
      status: 'PENDING'
    }, {
      password: workflow.hash,
      status: 'ACTIVE'
    }, function (err, user) {
      if (err) {
        req.app.logger.error('error during settings active flag and password', err);
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
