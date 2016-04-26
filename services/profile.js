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
    let file = req.files.file;
    let options = { new: true };

    fs.readFile(file.path, function (err, data) {
      if (err) {
        return workflow.emit('exception', err);
      }

      let query = {
        data,
        name: file.name,
        contentType: file.type
      };

      if (file.size / 1000000 > 1) {
        workflow.outcome.errors.push('Maximum file size is 1MB');
        return workflow.emit('response');
      }

      workflow.outcome.result = 'Uploaded';
      return workflow.emit('response');
    });
  }
};

export { profileApi };
