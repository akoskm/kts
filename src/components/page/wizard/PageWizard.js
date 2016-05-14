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

import WizardStart from './WizardStart';
import NameStep from './steps/NameStep';
import AddressStep from './steps/AddressStep';
import SummaryStep from './steps/SummaryStep';
import WizardFinish from './WizardFinish';
import Progress from './WizardProgress';
import Controls from './Controls';

export default class CreatePageWizard extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      step: 0,
      page: {
        name: '',
        addr: ''
      }
    };

    this.handleStartWizard = this.handleStartWizard.bind(this);
    this.submitWizard = this.submitWizard.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.validateNotEmpty = this.validateNotEmpty.bind(this);
    this.resetWizard = this.resetWizard.bind(this);
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

  handleStartWizard() {
    this.setState({
      step: 1
    });
  }

  submitWizard() {
    const self = this;
    console.log('send to server', this.state.page);
    $.post('/api/pages', this.state.page).done(function (data) {
      if (data.success) {
        self.setState({
          step: self.state.step + 1,
          url: '/' + data.result.nameslug
        });
      }
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

  resetWizard() {
    this.setState({
      step: 0
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
    case 0:
      return (
        <WizardStart startWizard={this.handleStartWizard}/>
      );
    case 1:
      return (
        <div>
          <Progress step={this.state.step}/>
          <NameStep
            validationState={this.getNameValidationState()}
            value={this.state.page.name}
            handleChange={this.handleChange}
          />
          <Controls
            handlePrevious={this.previous}
            handleNext={this.next}
            disabled={this.getNameValidationState()  !== 'success'}
            resetWizard={this.resetWizard}
          />
        </div>
      );
    case 2:
      return (
        <div>
          <Progress step={this.state.step}/>
          <AddressStep
            page={this.state.page}
            handleChange={this.handleChange}
            validateNotEmpty={this.validateNotEmpty}
          />
          <Controls
            handlePrevious={this.previous}
            handleNext={this.next}
            disabled={this.validateNotEmpty('addr') !== 'success'}
            resetWizard={this.resetWizard}
          />
        </div>
      );
    case 3:
      return (
        <div>
          <Progress step={this.state.step}/>
          <SummaryStep
            page={this.state.page}
          />
          <Controls
            handlePrevious={this.previous}
            handleNext={this.submitWizard}
            nextText='Submit'
            disabled={this.validateNotEmpty('addr') !== 'success'}
            resetWizard={this.resetWizard}
          />
        </div>
      );
    case 4:
      return (
        <WizardFinish page={this.state.page} url={this.state.url} closeWizard={this.resetWizard}/>
      );
    default:
      return (
        <WizardStart startWizard={this.handleStartWizard}/>
      );
    }
  }
}
