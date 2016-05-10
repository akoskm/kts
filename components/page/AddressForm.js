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
          controlId='formBasicText'
          validationState={this.props.addr1Validation}
        >
          <ControlLabel>Address Line 1</ControlLabel>
          <FormControl
            type='text'
            value={this.props.page.addr1}
            data-name='addr1'
            onChange={this.props.handleChange}
          />
          <FormControl.Feedback />
          <HelpBlock>Required.</HelpBlock>
        </FormGroup>
        <FormGroup
          controlId='formBasicText'
          validationState={this.props.addr2Validation}
        >
          <ControlLabel>Address Line 2</ControlLabel>
          <FormControl
            type='text'
            value={this.props.page.addr2}
            data-name='addr2'
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
  addr1Validation: React.PropTypes.object.isRequired,
  addr2Validation: React.PropTypes.object.isRequired,
  page: React.PropTypes.object.isRequired,
  handleChange: React.PropTypes.object.isRequired,
  handlePrevious: React.PropTypes.object.isRequired,
  handleNext: React.PropTypes.object.isRequired
};

export default AddressForm;
