import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';

import StartWizard from './StartWizard';
import NameForm from './NameForm';
import AddressForm from './AddressForm';
import SummaryForm from './SummaryForm';

export default class CreatePageWizard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      page: {
        name: ''
      }
    };

    this.startWizard = this.startWizard.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getNameValidationState() {
    let name = this.state.page.name;
    if (name) {
      const length = name.length;
      if (length < 6) {
        return 'error';
      } else {
        return 'success';
      }
    } else {
      return 'error';
    }
  }

  getAdd1ValidationState() {
    let addr1 = this.state.page.addr1;
    if (!addr1) {
      return 'error';
    }
    return 'success';
  }

  getAdd2ValidationState() {
    let addr2 = this.state.page.addr2;
    if (!addr2) {
      return 'error';
    }
    return 'success';
  }

  startWizard() {
    this.setState({
      step: 2
    });
  }

  next() {
    this.setState({
      step: this.state.step + 1
    });
  }

  previous() {
    this.setState({
      step: this.state.step - 1
    });
  }

  handleChange(e) {
    let target = e.target;
    let name = target.getAttribute('data-name');
    let obj = this.state.page;
    obj[name] = target.value;
    if (name) {
      this.setState({
        page: obj
      });
    }
  }

  render() {
    switch (this.state.step) {
    case 1:
      return (
        <StartWizard startWizard={this.startWizard}/>
      );
    case 2:
      return (
        <NameForm
          validationState={this.getNameValidationState()}
          value={this.state.page.name}
          handleChange={this.handleChange}
          handlePrevious={this.previous}
          handleNext={this.next}
        />
      );
    case 3:
      return (
        <AddressForm
          addr1Validation={this.getAdd1ValidationState()}
          addr2Validation={this.getAdd2ValidationState()}
          page={this.state.page}
          handleChange={this.handleChange}
          handlePrevious={this.previous}
          handleNext={this.next}
        />
      );
    case 4:
      return (
        <SummaryForm page={this.state.page} />
      );
    default:
      return (
        <StartWizard />
      );
    }
  }
}
