import React from 'react';
import $ from 'jquery';

import UserStore from '../stores/user/UserStore';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import CreatePageWizard from './page/wizard/PageWizard';
import Pages from './page/Pages';

export default class Profile extends React.Component {

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
      user: currentState.user,
      pages: []
    };

    this.handleWizardComplete = this.handleWizardComplete.bind(this);
  }

  componentDidMount() {
    this.serverRequest = $.get('/api/pages').done((response) => {
      let data = response.result;
      this.setState({
        pages: data
      });
    });
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  handleWizardComplete(newPage) {
    let pages = this.state.pages.concat([newPage]);
    this.setState({
      pages
    })
  }

  render() {
    return (
      <div>
        <Row>
          <Col xs={12} md={6} lg={6}>
            <CreatePageWizard onWizardComplete={this.handleWizardComplete}/>
            <Pages pages={this.state.pages}/>
          </Col>
        </Row>
      </div>
    );
  }
}
