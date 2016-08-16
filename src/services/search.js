import { logger } from '../util/logger';

import workflowFactory from '../util/workflow';
import mongoose from 'mongoose';

const searchApi = {

  filterPhotos(req, res, next) {
    const workflow = workflowFactory(req, res);

    workflow.on('findPage', function () {
      const query = {
        nameslug: req.query.page
      };
      mongoose.model('Page').findOne(query, function (err, page) {
        if (err || !page) {
          logger.instance.error('Cannot find page', err);
          workflow.outcome.errors.push('An error occurred');
          return workflow.emit('response');
        }

        workflow.page = page;
        workflow.emit('filter');
      });
    });

    workflow.on('filter', function () {
      let tags = [];
      let queryTags = req.query.tags;
      if (!workflow.page && (!queryTags || queryTags.length < 1)) {
        return workflow.emit('initialResponse');
      }
      /**
       * TODO
       * this should be added as the default query as soon as we implement
       * public flag on the client
       */
      const query = {
        // published: true
      };
      if (workflow.page) {
        query.page = workflow.page._id;
      }
      if (queryTags) {
        if (typeof queryTags === 'string') {
          tags = [queryTags];
        } else if (tags.constructor === Array) {
          tags = queryTags;
        }
        if (tags.length > 0) {
          query.tags = {
            $in: tags
          };
        }
      }
      mongoose.model('Photo').find(query).populate('page', 'nameslug').exec(function (err, doc) {
        if (err) {
          logger.instance.error('Error while filtering photos', err);
          workflow.outcome.errors.push('An error occurred');
          return workflow.emit('response');
        }
        workflow.outcome.result = doc;
        return workflow.emit('response');
      });
    });

    workflow.on('initialResponse', function () {
      mongoose.model('Photo').find({})
      .sort('-createdOn')
      .populate('page', 'nameslug')
      .exec(function (err, doc) {
        if (err) {
          logger.instance.error('Error while filtering photos', err);
          workflow.outcome.errors.push('An error occurred');
          return workflow.emit('response');
        }
        workflow.outcome.result = doc;
        return workflow.emit('response');
      });
    });

    if (req.query.page) {
      workflow.emit('findPage');
    } else {
      workflow.emit('filter');
    }
  }
};

export { searchApi };
