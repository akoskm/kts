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

class AddressForm extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <form>
        <FormGroup
          controlId='addr'
          validationState={this.props.validateNotEmpty('addr')}
        >
          <ControlLabel>Address</ControlLabel>
          <FormControl
            componentClass='textarea'
            type='text'
            value={this.props.page.addr}
            data-name='addr'
            onChange={this.props.handleChange}
          />
          <FormControl.Feedback />
          <HelpBlock>Required.</HelpBlock>
        </FormGroup>
        <ButtonToolbar>
          <Button onClick={this.props.handlePrevious}>Back</Button>
          <Button bsStyle='primary' onClick={this.props.handleNext}>Next</Button>
        </ButtonToolbar>
      </form>
    );
  }
}

AddressForm.propTypes = {
  validateNotEmpty: React.PropTypes.object.isRequired,
  page: React.PropTypes.object.isRequired,
  handleChange: React.PropTypes.object.isRequired,
  handlePrevious: React.PropTypes.object.isRequired,
  handleNext: React.PropTypes.object.isRequired
};

export default AddressForm;
