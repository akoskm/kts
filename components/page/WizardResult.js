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
            <Button bsStyle='primary'>Show me</Button>
            <span> or </span>
            <Button onClick={this.handleAlertDismiss}>Close this wizard</Button>
          </p>
        </Alert>
    );
  }
}

WizardResult.propTypes = {
  page: React.PropTypes.object.isRequired
};

export default WizardResult;
