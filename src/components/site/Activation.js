import React from 'react';
import request from 'superagent';

import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';

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
    request.post('/api/activate').send(this.state).then(function (data) {
      console.log('success', data);
    });
  }

  render() {
    return (
      <div>
        <p>Hi!</p>
        <form className='activationForm' onSubmit={this.handleSubmit}>
          <div>
            <FormControl
              id='pass'
              placeholder='Password'
              type='password'
              value={this.state.pass}
              onChange={this.handlePassChange}
            />
          </div>
          <div>
            <FormControl
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
