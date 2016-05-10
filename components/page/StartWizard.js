import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class StartWizard extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={12} md={6} lg={6}>
             <Button bsStyle='primary' onClick={this.props.startWizard}>Create a Page</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

StartWizard.propTypes = {
  startWizard: React.PropTypes.object.isRequired
};

export default StartWizard;
