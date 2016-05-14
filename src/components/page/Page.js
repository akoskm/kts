import React from 'react';
import $ from 'jquery';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import DropzoneComponent from 'react-dropzone-component';

import Photos from '../photo/Photos';

class Page extends React.Component {

  constructor(props, context) {
    super(props, context);
    let initialStateStr = this.props.params.context || process.APP_STATE;
    let initialState = {};
    if (initialStateStr) {
      initialState = JSON.parse(initialStateStr);
    }
    this.state = {
      page: initialState,
      files: []
    };

    this.onItemClick = this.onItemClick.bind(this);
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

  onItemClick(i) {
    this.state.files.splice(i, 1);
    this.setState({
      files: this.state.files
    });
  }

  getUploadURL() {
    const nameslug = this.props.routeParams.nameslug;
    return '/api/pages/' + nameslug + '/photos';
  }

  render() {
    let callbackArray = [
      function () {
        console.log('Look Ma, I\'m a callback in an array!');
      },
      function () {
        console.log('Wooooow!');
      }
    ];
    let eventHandlers = {
      // All of these receive the event as first parameter:
      drop: callbackArray
    };
    let componentConfig = {
      iconFiletypes: ['.jpg', '.png', '.gif'],
      showFiletypeIcon: true,
      postUrl: this.getUploadURL()
    };

    let djsConfig = {
      addRemoveLinks: true,
      acceptedFiles: 'image/jpeg,image/png,image/gif'
    };

    return (
      <div>
        <Row>
          <Col xs={12} lg={12} md={12}>
            <h1>{this.state.page.name}</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6} lg={6}>
            <h4>Upload Photos</h4>
            <DropzoneComponent djsConfig={djsConfig}
              config={componentConfig}
              eventHandlers={eventHandlers}
            />
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <h4>Photos</h4>
          </Col>
        </Row>
        <Photos nameslug={this.props.routeParams.nameslug}/>
      </div>
    );
  }
}

Page.propTypes = {
  params: React.PropTypes.object.isRequired,
  routeParams: React.PropTypes.object.isRequired
};

export default Page;
