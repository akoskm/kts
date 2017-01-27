import React from 'react';
import request from 'superagent';

import Alert from 'react-bootstrap/lib/Alert';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

class ActivationComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      token: this.props.params.token,
      alerts: [],
      success: false,
      pass: '',
      repass: '',
      passSet: '',
      repassSet: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGoToSignIn = this.handleGoToSignIn.bind(this);
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

  handleGoToSignIn() {
    this.props.history.pushState(null, '/signin');
  }

  handleSubmit(event) {
    if (event)
      event.preventDefault();

    // reset initial state
    this.setState({
      passSet: '',
      repassSet: '',
      errorMessage: ''
    });

    let passSet = !!this.state.pass;
    let repassSet = !!this.state.repass;

    if (passSet && repassSet) {
      if (this.state.pass !== this.state.repass) {
        this.setState({
          errorMessage: 'Passwords don\'t match'
        })
      } else {
        request.post('/api/activate').send(this.state).then((data) => {
          const res = data.body;
          if (res.errors.length > 0) {
            this.setState({
              success: res.success,
              errorMessage: res.errors[0]
            })
          } else {
            this.setState({
              success: res.success
            });
          }
        });
      }
    } else {
      this.setState({
        passSet,
        repassSet,
        errorMessage: ''
      });
    }
  }

  render() {
    const successAlert = <Alert bsStyle='success'>
      <p>Activation successful, you can now <a onClick={this.handleGoToSignIn}>Sign In</a>.</p>
    </Alert>;
    let activateButton = <Button type='submit' secondary>Activate</Button>;
    let passHelp;
    let repassHelp;
    let passErrorClass;
    let repassErrorClass;
    let alert;
    if (this.state.passSet === false) {
      passHelp = <HelpBlock>Password is required</HelpBlock>;
      passErrorClass = 'error';
    }
    if (this.state.repassSet === false) {
      repassHelp = <HelpBlock>Repeat Password is required</HelpBlock>;
      repassErrorClass = 'error';
    }
    if (this.state.errorMessage) {
      alert = (<Alert bsStyle='danger'>
        <p>{this.state.errorMessage}</p>
      </Alert>);
    } else {
      if (this.state.success) {
        alert = successAlert;
        activateButton = '';
      }
    }

    return (
      <Row>
        <Col md={4}>
          <p>Fill out the activation form and click Activate.</p>
          <form className='activationForm' onSubmit={this.handleSubmit}>
            <FormGroup controlId='pass' validationState={passErrorClass}>
              <ControlLabel>Password</ControlLabel>
              <FormControl
                id='pass'
                type='password'
                value={this.state.pass}
                onChange={this.handlePassChange}
              />
              {passHelp}
            </FormGroup>
            <FormGroup controlId='repass' validationState={repassErrorClass}>
              <ControlLabel>Repeat Password</ControlLabel>
              <FormControl
                id='repass'
                type='password'
                value={this.state.repass}
                onChange={this.handleRePassChange}
              />
              {repassHelp}
            </FormGroup>
            {alert}
            {activateButton}
          </form>
        </Col>
      </Row>
    );
  }
}

ActivationComponent.propTypes = {
  params: React.PropTypes.object.isRequired
};

export default ActivationComponent;
