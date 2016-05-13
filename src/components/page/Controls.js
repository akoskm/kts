import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';

class Controls extends React.Component {

  render() {
    return (
      <ButtonToolbar>
        <Button onClick={this.props.handlePrevious}>Back</Button>
        <Button
          bsStyle='primary'
          onClick={this.props.handleNext}
          disabled={this.props.disabled}
        >{this.props.nextText || 'Next'}</Button>
      <Button onClick={this.props.resetWizard}
        bsStyle='warning'
        className='pull-right'
      >Cancel</Button>
      </ButtonToolbar>
    );
  }
}

Controls.propTypes = {
  nextText: React.PropTypes.object.isRequired,
  disabled: React.PropTypes.object.isRequired,
  validationState: React.PropTypes.object.isRequired,
  handlePrevious: React.PropTypes.object.isRequired,
  handleNext: React.PropTypes.object.isRequired,
  resetWizard: React.PropTypes.func.isRequired
};

export default Controls;
