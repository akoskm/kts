import React from 'react';
import $ from 'jquery';

import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

export default class RegisterComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      phone: ''
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmailChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  handlePhoneChange(e) {
    this.setState({
      phone: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('send to server', this.state);
    $.post('/api/register', this.state).done(function (data) {
      console.log('success', data);
    });
  }

  render() {
    return (
      <div>
        <p>Fill out the registration form</p>
        <form className='registrationForm' onSubmit={this.handleSubmit}>
          <div>
            <TextField
              id='email'
              hintText='Email'
              type='text'
              value={this.state.email}
              onChange={this.handleEmailChange}
              errorText={this.state.emailError}
            />
          </div>
          <div>
            <TextField
              id='tel'
              hintText='Phone'
              type='phone'
              value={this.state.phone}
              onChange={this.handlePhoneChange}
              errorText={this.state.phoneError}
            />
          </div>
          <div>
            <RaisedButton type='submit' label='Register' secondary/>
          </div>
        </form>
      </div>
    );
  }
}
