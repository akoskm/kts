import React from 'react';

import Alert from 'react-bootstrap/lib/Alert';
import Button from 'react-bootstrap/lib/Button';

class WizardResult extends React.Component {

  render() {
    return (
      <Alert bsStyle='success'>
          <h4>Success!</h4>
          <p>{this.props.page.name} has been created.</p>
          <p>
            <Button bsStyle='primary' href={this.props.url}>Show me</Button>
            <span> or </span>
            <Button onClick={this.props.closeWizard}>Close this wizard</Button>
          </p>
        </Alert>
    );
  }
}

WizardResult.propTypes = {
  closeWizard: React.PropTypes.object.isRequired,
  page: React.PropTypes.object.isRequired,
  url: React.PropTypes.object.isRequired
};

export default WizardResult;
