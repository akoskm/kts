import React from 'react';
import { dispatch } from '../stores/user/UserDispatcher';
import UserStore from '../stores/user/UserStore';
import { Container } from 'flux/utils';
import { Link } from 'react-router';

import $ from 'jquery';

import ThemeManager from 'material-ui/lib/styles/theme-manager';
import MyRawTheme from '../styles/mui-theme';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';
import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/lib/menus/menu-item';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import RaisedButton from 'material-ui/lib/raised-button';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';

class HeaderComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      labelText: 'Sign In'
    };

    this.goToSignIn = this.goToSignIn.bind(this);
    this.goToSignUp = this.goToSignUp.bind(this);
    this.signOut = this.signOut.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
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

  handleToggle() {
    this.setState({
      open: !this.state.open
    });
  }

  goToSignIn(e) {
    this.props.history.pushState(null, '/signin');
  }

  goToSignUp(e) {
    this.props.history.pushState(null, '/signup');
  }

  signOut(e) {
    let self = this;
    $.post('/api/logout', this.state).done(function (data) {
      if (data.success) {
        dispatch({
          type: 'user/logout'
        });
        self.props.history.pushState(null, '/');
      }
    });
  }

  render() {
    const { username } = this.props;
    let userMenu;
    let signUpButton;
    if (username !== 'Sign In') {
      userMenu =
      <IconMenu
        iconButtonElement={
          <IconButton touch>
            <NavigationExpandMoreIcon />
          </IconButton>
        }
      >
        <MenuItem primaryText='Help' />
        <MenuItem primaryText='Sign Out' onClick={this.signOut} />
      </IconMenu>;
    } else {
      signUpButton = <RaisedButton onClick={this.goToSignUp} label='Sign Up'/>;
    }
    return (
      <Toolbar
        className='kts-navbar'
      >
        <ToolbarGroup float='left'>
          <ToolbarTitle className='title' text='KTS Project' />
        </ToolbarGroup>
        <ToolbarGroup float='right'>
          <FontIcon className='muidocs-icon-custom-sort' />
          {userMenu}
          <RaisedButton primary onClick={this.goToSignIn} label={username}/>
          {signUpButton}
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

HeaderComponent.propTypes = {
  history: React.PropTypes.object.isRequired,
  username: React.PropTypes.string.isRequired
};

const container = Container.create(HeaderComponent);

export default HeaderComponent;
