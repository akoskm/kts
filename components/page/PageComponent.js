import React from 'react';
import $ from 'jquery';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class PageComponent extends React.Component {

  constructor(props, context) {
    super(props, context);
    let initialStateStr = this.props.params.context || process.APP_STATE;
    let initialState = {};
    if (initialStateStr) {
      initialState = JSON.parse(initialStateStr);
    }
    this.state = {
      page: initialState
    };
  }

  componentDidMount() {
    let nameslug = this.props.routeParams.nameslug;
    this.serverRequest = $.get('/api/pages/' + nameslug, function (response) {
      let data = response.result;
      if (response.success) {
        this.setState({
          page: data
        });
      }
    }.bind(this));
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  render() {
    return (
      <Row>
        <Col xs={12} lg={12} md={12}>
          <h1>{this.state.page.name}</h1>
        </Col>
      </Row>
    );
  }
}

PageComponent.propTypes = {
  params: React.PropTypes.object.isRequired,
  routeParams: React.PropTypes.object.isRequired
};

export default PageComponent;
