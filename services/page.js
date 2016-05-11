import fs from 'fs';
import workflowFactory from '../util/workflow';
import mongoose from 'mongoose';

const pageApi = {

  createPage(req, res, next) {
    const workflow = workflowFactory(req, res);

    workflow.on('validatePage', function () {
      const page = req.body;

      if (!page.name) {
        workflow.outcome.errfor.name = 'Required';
      }

      if (!page.addr) {
        workflow.outcome.errfor.addr = 'Required';
      }

      if (workflow.hasErrors()) {
        return workflow.emit('response');
      }

      workflow.emit('createPage');
    });

    workflow.on('createPage', function () {
      mongoose.model('Page').create({
        name: req.body.name,
        address: req.body.addr,
        owner: req.user
      }, function (err, doc) {
        if (err) {
          req.app.logger.error('Error while saving page', err);
          workflow.outcome.errors.push('Cannot create page');
          return workflow.emit('response');
        }
        workflow.outcome.result = doc;
        return workflow.emit('response');
      });
    });

    workflow.emit('validatePage');
  },

  getPages(req, res, next) {
    const workflow = workflowFactory(req, res);

    workflow.on('getPages', function () {
      mongoose.model('Page').find({ owner: req.user }, function (err, doc) {
        if (err) {
          req.app.logger.error('Error while fetching pages', err);
          workflow.outcome.errors.push('Cannot fetch pages');
          return workflow.emit('response');
        }

        workflow.outcome.result = doc;
        return workflow.emit('response');
      });
    });

    workflow.emit('getPages');
  },

  findPage(req, res, next) {
    const workflow = workflowFactory(req, res);
    const self = this;

    workflow.on('findPage', function () {
      pageApi._findPage(req.params.nameslug, req.app.logger, function (err, doc) {
        if (err) {
          workflow.outcome.errors.push(err);
          return workflow.emit('response');
        }

        workflow.outcome.result = doc;
        return workflow.emit('response');
      });
    });

    workflow.emit('findPage');
  },

  _findPage(nameslug, logger, cb) {
    mongoose.model('Page').findOne({ nameslug }, function (err, doc) {
      if (err) {
        logger.error('Error while fetching pages', err);
        return cb('Cannot fetch pages', null);
      }

      return cb(null, doc);
    });
  }
};

export { pageApi };
