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
          req.app.logger.error('Error while saving image', err);
          workflow.outcome.errors.push('Cannot create page');
          return workflow.emit('response');
        }
        workflow.outcome.result = doc;
        return workflow.emit('response');
      });
    });

    workflow.emit('validatePage');
  }
};

export { pageApi };
