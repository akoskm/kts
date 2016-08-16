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

    workflow.on('pageLookup', function () {
      mongoose.model('Page').findOne({
        nameslug: req.params.nameslug
      }, '_id', function (err, page) {
        if (err) {
          logger.instance.error('Cannot get photos', err);
        }
        if (!page) {
          workflow.outcome.errors.push('Page doesn\'t exist');
          workflow.emit('response');
        } else {
          workflow.page = page;
          workflow.emit('imageLookup');
        }
      });
    });

    workflow.on('imageLookup', function () {
      mongoose.model('Photo').find({
        page: workflow.page._id
      }, function (err, photos) {
        workflow.outcome.result = photos;
        return workflow.emit('response');
      });
    });

    workflow.emit('pageLookup');
  },

  uploadPhoto(req, res, next) {
    const workflow = workflowFactory(req, res);
    const file = req.file;

    workflow.on('validate', function () {
      if (file.size / 1000000 > 1) {
        workflow.outcome.errors.push('Maximum file size is 1MB');
        return workflow.emit('response');
      }

      mongoose.model('Page').findOne({
        owner: req.user,
        nameslug: req.params.nameslug
      }, function (err, page) {
        if (err) throw err;
        if (!page) {
          workflow.outcome.errors.push('Page doesn\t exist');
          return workflow.emit('response');
        }
        workflow.page = page;
        workflow.emit('upload');
      });
    });

    workflow.on('upload', function () {
      fs.readFile(file.path, function (err, data) {
        if (err) {
          return workflow.emit('exception', err);
        }

        mongoose.model('Photo').create({
          size: file.size,
          name: file.originalname,
          filename: file.filename,
          contentType: file.mimetype,
          originalFilename: file.originalname,
          page: workflow.page._id,
          createdBy: req.user
        }, function (err, doc) {
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

    workflow.emit('validate');
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
          logger.instance.error('Error while removing photo', err);
          workflow.outcome.errors.push('Cannot delete photo');
          return workflow.emit('response');
        }
        workflow.outcome.result = 'Deleted';
        return workflow.emit('response');
      });
    });

    workflow.emit('deletePicture');
  },

  updatePhoto(req, res, next) {
    const workflow = workflowFactory(req, res);

    workflow.on('validate', function () {
      mongoose.model('Page').findOne({
        owner: req.user,
        nameslug: req.params.nameslug
      }, function (err, page) {
        if (err) {
          logger.instance.error('Page doesn\'t exist', err);
          workflow.outcome.errors.push('An error occurred');
          return workflow.emit('response');
        }

        workflow.outcome.page = page;
        return workflow.emit('updatePhoto');
      });
    });

    workflow.on('updatePhoto', function () {
      const query = {
        name: req.body.name,
        tags: req.body.tags
      };
      mongoose.model('Photo').findByIdAndUpdate(
        req.params.photoid,
        query,
        function (err, doc) {
          if (err) {
            logger.instance.error('Error while updating photo', err);
            workflow.outcome.errors.push('Cannot delete photo');
            return workflow.emit('response');
          }

          workflow.outcome.result = 'Updated';
          return workflow.emit('response');
        });
    });

    workflow.emit('validate');
  }
};

export { pageApi };
