import React from 'react';
import $ from 'jquery';

import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';

class ActivationComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      token: this.props.params.token
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleRePassChange = this.handleRePassChange.bind(this);
  }

  handlePassChange(e) {
    this.setState({
      pass: e.target.value
    });
  }

  handleRePassChange(e) {
    this.setState({
      repass: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log('send to server', this.state);
    $.post('/api/activate', this.state).done(function (data) {
      console.log('success', data);
    });
  }

  render() {
    return (
      <div>
        <p>Hi!</p>
        <form className='activationForm' onSubmit={this.handleSubmit}>
          <div>
            <Input
              id='pass'
              placeholder='Password'
              type='password'
              value={this.state.pass}
              onChange={this.handlePassChange}
            />
          </div>
          <div>
            <Input
              id='repass'
              placeholder='Repeat Password'
              type='password'
              value={this.state.repass}
              onChange={this.handleRePassChange}
            />
          </div>
          <div>
            <Button type='submit' secondary>Activate</Button>
          </div>
        </form>
      </div>
    );
  }
}

ActivationComponent.propTypes = {
  params: React.PropTypes.object.isRequired
};

export default ActivationComponent;
