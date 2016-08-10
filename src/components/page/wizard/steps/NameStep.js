import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import Input from 'react-bootstrap/lib/Input';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';

class NameForm extends React.Component {

  render() {
    return (
        <form>
          <FormGroup
            controlId='formBasicText'
            validationState={this.props.validationState}
          >
            <ControlLabel>Name your page</ControlLabel>
            <FormControl
              type='text'
              value={this.props.value}
              data-name='name'
              onChange={this.props.handleChange}
            />
            <FormControl.Feedback />
            <HelpBlock>Name must be at least 5 characters long</HelpBlock>
          </FormGroup>
        </form>
    );
  }
}

NameForm.propTypes = {
  validationState: React.PropTypes.object.isRequired,
  value: React.PropTypes.object.isRequired,
  handleChange: React.PropTypes.object.isRequired,
  handlePrevious: React.PropTypes.object.isRequired,
  handleNext: React.PropTypes.object.isRequired,
  resetWizard: React.PropTypes.func.isRequired
};

export default NameForm;
