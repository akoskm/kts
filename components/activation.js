import React from 'react';
import $ from 'jquery';

import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';

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
            <TextField
              id='pass'
              hintText='Password'
              type='password'
              value={this.state.pass}
              onChange={this.handlePassChange}
            />
          </div>
          <div>
            <TextField
              id='repass'
              hintText='Repeat Password'
              type='password'
              value={this.state.repass}
              onChange={this.handleRePassChange}
            />
          </div>
          <div>
            <RaisedButton type='submit' label='Activate' secondary/>
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
