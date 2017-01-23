'use strict';

import UserActionTypes from './UserActionTypes';
import UserDispatcher from './UserDispatcher';

const Actions = {
  logIn(user) {
    UserDispatcher.dispatch({
      type: UserActionTypes.LOGIN,
      user
    });
  },

  logOut(user) {
    UserDispatcher.dispatch({
      type: UserActionTypes.LOGOUT,
      user
    });
  }
};

export default Actions;
