import React from 'react';

import Alert from 'react-bootstrap/lib/Alert';
import Button from 'react-bootstrap/lib/Button';

class WizardResult extends React.Component {

  render() {
    return (
      <Alert bsStyle='success' onDismiss={this.handleAlertDismiss}>
          <h4>Success!</h4>
          <p>Your page has been created!</p>
          <p>
            <Button bsStyle='primary'>Show me</Button>
            <span> or </span>
            <Button onClick={this.handleAlertDismiss}>Close this wizard</Button>
          </p>
        </Alert>
    );
  }
}

export default WizardResult;
