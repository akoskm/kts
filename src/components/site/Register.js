import React from 'react';
import request from 'superagent';

import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

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

  handleSubmit(event) {
    event.preventDefault();
    console.log('send to server', this.state);
    request.post('/api/register').send(this.state).done(function (data) {
      console.log('success', data);
    });
  }

  render() {
    return (
      <Row>
        <Col md={3}>
          <p>Fill out the registration form</p>
          <form className='registrationForm' onSubmit={this.handleSubmit}>
            <div>
              <FormControl
                id='email'
                placeholder='Email'
                type='text'
                value={this.state.email}
                onChange={this.handleEmailChange}
                errorText={this.state.emailError}
              />
            </div>
            <div>
              <FormControl
                id='tel'
                placeholder='Phone'
                type='phone'
                value={this.state.phone}
                onChange={this.handlePhoneChange}
                errorText={this.state.phoneError}
              />
            </div>
            <div>
              <Button type='submit' secondary>Register</Button>
            </div>
          </form>
        </Col>
      </Row>
    );
  }
}
