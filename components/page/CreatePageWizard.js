import React from 'react';
import $ from 'jquery';

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
import WizardResult from './WizardResult';

export default class CreatePageWizard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      step: 1,
      page: {
        name: '',
        addr: ''
      }
    };

    this.startWizard = this.startWizard.bind(this);
    this.submitWizard = this.submitWizard.bind(this);
    this.closeWizard = this.closeWizard.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateNotEmpty = this.validateNotEmpty.bind(this);
  }

  getNameValidationState() {
    let name = this.state.page.name;
    if (name) {
      const length = name.length;
      if (length < 5) {
        return 'error';
      } else {
        return 'success';
      }
    } else {
      return 'error';
    }
  }

  startWizard() {
    this.setState({
      step: 2
    });
  }

  submitWizard() {
    const self = this;
    console.log('send to server', this.state.page);
    $.post('/api/page', this.state.page).done(function (data) {
      if (data.success) {
        self.setState({
          step: self.state.step + 1,
          url: '/' + data.result.nameslug
        });
      }
    });
  }

  closeWizard() {
    this.setState({
      step: 1
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

  validateNotEmpty(field) {
    const page = this.state.page;
    if (!page[field]) {
      return 'error';
    }
    return 'success';
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
          page={this.state.page}
          handleChange={this.handleChange}
          handlePrevious={this.previous}
          handleNext={this.next}
          validateNotEmpty={this.validateNotEmpty}
        />
      );
    case 4:
      return (
        <SummaryForm
          page={this.state.page}
          handlePrevious={this.previous}
          handleSubmit={this.submitWizard}
        />
      );
    case 5:
      return (
        <WizardResult page={this.state.page} url={this.state.url} closeWizard={this.closeWizard}/>
      );
    default:
      return (
        <StartWizard startWizard={this.startWizard}/>
      );
    }
  }
}
