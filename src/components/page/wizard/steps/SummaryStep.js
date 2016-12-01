import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
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
      </form>
    );
  }
}

SummaryForm.propTypes = {
  page: React.PropTypes.object.isRequired,
  handlePrevious: React.PropTypes.object.isRequired,
  handleSubmit: React.PropTypes.object.isRequired
};

export default SummaryForm;
