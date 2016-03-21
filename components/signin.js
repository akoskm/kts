import React from 'react';
import $ from 'jquery';
import { Navigation } from 'react-router';
import { dispatch } from '../stores/user/UserDispatcher';

import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

class SignInComponent extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      email: '',
      passw: ''
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  handlePassChange(e) {
    this.setState({
      passw: e.target.value
    });
  }

  handleSubmit(e) {
    let self = this;
    e.preventDefault();
    if (!this.state.email) {
      this.state.emailError = 'Username is required';
      if (!this.state.passw) {
        this.state.passwError = 'Password is required';
      }
    } else {
      $.post('/api/login', this.state).done(function (data) {
        if (data.success) {
          let user = data.user;
          this.state = {
            username: user.username,
            status: user.status
          };
          dispatch({
            type: 'user/login',
            user
          });
          self.props.history.pushState(null, '/about');
        }
      });
    }
  }

  render() {
    return (
      <div>
        <form className='registrationForm' onSubmit={this.handleSubmit}>
          <div>
            <TextField
              id='email'
              hintText='Username'
              type='text'
              value={this.state.email}
              onChange={this.handleEmailChange}
              errorText={this.state.emailError}
            />
          </div>
          <div>
            <TextField
              id='passw'
              hintText='Password'
              type='password'
              value={this.state.passw}
              onChange={this.handlePassChange}
              errorText={this.state.passwError}
            />
          </div>
          <div>
            <RaisedButton type='submit' label='Log in' secondary/>
          </div>
        </form>
      </div>
    );
  }
}

SignInComponent.propTypes = {
  history: React.PropTypes.object.isRequired
};

export default SignInComponent;
