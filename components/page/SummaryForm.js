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

class SummaryForm extends React.Component {

  render() {
    return (
      <form>
        <FormGroup controlId='formBasicText'>
          <ControlLabel>Page Name</ControlLabel>
          <p>{this.props.page.name}</p>
        </FormGroup>
        <FormGroup controlId='formBasicText'>
          <ControlLabel>Address</ControlLabel>
          <pre>{this.props.page.addr}</pre>
        </FormGroup>
        <ButtonToolbar>
          <Button onClick={this.props.handlePrevious}>Back</Button>
          <Button
            bsStyle='primary'
            onClick={this.props.handleNext}
          >Looks good, create the page</Button>
        </ButtonToolbar>
      </form>
    );
  }
}

SummaryForm.propTypes = {
  page: React.PropTypes.object.isRequired,
  handlePrevious: React.PropTypes.object.isRequired,
  handleNext: React.PropTypes.object.handleNext
};

export default SummaryForm;
