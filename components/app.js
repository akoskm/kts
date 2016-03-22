import React, { PropTypes } from 'react';
import { Container } from 'flux/utils';

import $ from 'jquery';
import { Link } from 'react-router';

import type Immutable from 'immutable';
import User from '../stores/user/User';
import UserStore from '../stores/user/UserStore';

import Header from './header';

class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
  }

  componentDidMount() {
    let self = this;
    $.get('/api/profile').done(function (data) {
      if (data.success) {
        self.setState({
          user: data.user
        });
      }
    });
  }

  static getStores() {
    return [UserStore];
  }

  static calculateState(prevState) {
    let currentState = {
      user: UserStore.getState(),
      isLoggedIn: UserStore.isLoggedIn()
    };
    return currentState;
  }

  render() {
    let currentUser = UserStore.getLoggedInUser();
    let username;
    if (currentUser.username) {
      username = currentUser.username;
    }
    if (!username && this.state.user) {
      username = this.state.user.username;
    }
    if (!username) {
      username = 'Sign In';
    }
    return (
      <div>
        <Header username={username} {...this.props}/>
        <div className='main-container'>
          { this.props.children }
          <hr/>
        </div>
      </div>
    );
  }
}

AppComponent.propTypes = {
  children: React.PropTypes.object.isRequired
};

AppComponent.childContextTypes = {
  muiTheme: React.PropTypes.object
};

const container = Container.create(AppComponent);

export default AppComponent;
