import { logger } from '../util/logger';

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
          logger.instance.error('Error while saving page', err);
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
          logger.instance.error('Error while fetching pages', err);
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
      pageApi._findPage(req.params.nameslug, logger.instance, function (err, doc) {
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
  },

  getPhotos(req, res, next) {
    const workflow = workflowFactory(req, res);

    workflow.on('imageLookup', function () {
      mongoose.model('Page').findOne({
        nameslug: req.params.nameslug
      }, '_id photos', function (err, doc) {
        if (err) {
          logger.instance.error('Cannot get photos', err);
        }
        workflow.outcome.result = doc;
        return workflow.emit('response');
      });
    });

    workflow.emit('imageLookup');
  },

  uploadPhoto(req, res, next) {
    const workflow = workflowFactory(req, res);
    const file = req.file;

    workflow.on('upload', function () {
      fs.readFile(file.path, function (err, data) {
        if (err) {
          return workflow.emit('exception', err);
        }

        if (file.size / 1000000 > 1) {
          workflow.outcome.errors.push('Maximum file size is 1MB');
          return workflow.emit('response');
        }

        let query = {
          $push: {
            photos: {
              filename: file.filename,
              name: file.originalname,
              contentType: file.mimetype,
              size: file.size
            }
          }
        };

        mongoose.model('Page').findOneAndUpdate({
          owner: req.user,
          nameslug: req.params.nameslug
        }, query, function (err, doc) {
          if (err) {
            logger.instance.error('Error while saving image', err);
            workflow.outcome.errors.push('Cannot save image');
            return workflow.emit('response');
          }
          workflow.outcome.result = 'Uploaded';
          return workflow.emit('response');
        });
      });
    });

    workflow.emit('upload');
  },

  deletePhoto(req, res, next) {
    const workflow = workflowFactory(req, res);

    workflow.on('deletePicture', function () {
      let query = {
        $pull: {
          photos: {
            _id: req.params.photoid
          }
        }
      };

      mongoose.model('Page').findOneAndUpdate({
        owner: req.user,
        nameslug: req.params.nameslug
      }, query, function (err, doc) {
        if (err) {
          logger.instance.error('Error while removing image', err);
          workflow.outcome.errors.push('Cannot delete image');
          return workflow.emit('response');
        }
        workflow.outcome.result = 'Deleted';
        return workflow.emit('response');
      });
    });

    workflow.emit('deletePicture');
  },

  updateTags(req, res, next) {

  }
};

export { pageApi };
