import { ReduceStore } from 'flux/utils';

import User from './User';
import UserActionTypes from './UserActionTypes';
import UserDispatcher from './UserDispatcher';

// Set up the store, If we didn't care about order we could just use MapStore
class UserStore extends ReduceStore {

  constructor() {
    super(UserDispatcher);
  }

  getInitialState() {
    // return Immutable.OrderedMap();
    return {};
  }

  reduce(state, action) {
    switch (action.type) {
      case UserActionTypes.LOGIN:
        this._user = action.user;
        return state;

      case UserActionTypes.LOGOUT:
        delete this._user;
        return state;

      default:
        return state;
    }
  }

  getLoggedInUser() {
    if (this._user) {
      return this._user;
    }
    return {};
  }

  isLoggedIn() {
    return !!this._user;
  }
}

// Export a singleton instance of the store, could do this some other way if
// you want to avoid singletons.
export default new UserStore();
