import React from 'react';

import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';

class Progress extends React.Component {

  render() {
    return (
      <Nav bsStyle='tabs' activeKey={this.props.step}>
        <NavItem eventKey={1} disabled>Name</NavItem>
        <NavItem eventKey={2} disabled>Address</NavItem>
        <NavItem eventKey={3} disabled>Summary</NavItem>
      </Nav>
    );
  }
}

Progress.propTypes = {
  step: React.PropTypes.object.isRequired,
  handleSelect: React.PropTypes.object.isRequired
};

export default Progress;
