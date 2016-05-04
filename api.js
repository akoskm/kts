import register from './services/register';
import activate from './services/activate';
import signin from './services/signin';
import signout from './services/signout';
import { profileApi } from './services/profile';

const api = {
  register,
  activate,
  signin,
  signout,
  profile: profileApi.profile,
  uploadPhoto: profileApi.uploadPhoto,
  deletePhoto: profileApi.deletePhoto,
  getPhotos: profileApi.getProfilePhotos
};

export { api };
