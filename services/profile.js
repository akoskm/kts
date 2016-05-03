import fs from 'fs';
import workflow from '../util/workflow';

const profileApi = {
  profile(req, res) {

    res.status(200).json({
      success: true,
      user: req.user
    });
  },

  uploadProfilePicture(req, res, next) {
    const wf = workflow(req, res);
    const file = req.file;

    wf.on('upload', function () {
      fs.readFile(file.path, function (err, data) {
        if (err) {
          return wf.emit('exception', err);
        }

        let query = {
          data,
          name: file.originalname,
          contentType: file.mimetype
        };

        if (file.size / 1000000 > 1) {
          wf.outcome.errors.push('Maximum file size is 1MB');
          return wf.emit('response');
        }

        wf.outcome.result = 'Uploaded';
        return wf.emit('response');
      });
    });

    wf.emit('upload');
  }
};

export { profileApi };
