import React from 'react';
import UserStore from '../stores/user/UserStore';

import FormControl from 'react-bootstrap/lib/FormControl';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import CreatePageWizard from './page/wizard/PageWizard';
import Pages from './page/Pages';

export default class IndexComponent extends React.Component {

  constructor(props) {
    super(props);

    let currentState = {
      user: UserStore.getLoggedInUser(),
      isLoggedIn: UserStore.isLoggedIn()
    };

    this.state = {
      open: false,
      labelText: 'Sign In',
      username: '',
      user: currentState.user
    };
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={12} md={6} lg={6}>
            <div>
              <FormControl
                type='text'
                placeholder='Name'
              />
              <FormControl
                type='text'
                placeholder='Email'
              />
            </div>
          </Col>
          <Col xs={12} md={6} lg={6}>
            <CreatePageWizard />
            <Pages />
          </Col>
        </Row>
      </div>
    );
  }
}
