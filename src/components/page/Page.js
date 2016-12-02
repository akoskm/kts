import React from 'react';
import request from 'superagent';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import DropzoneComponent from 'react-dropzone-component';

import Photos from '../photo/Photos';
import Albums from '../albums/Albums';

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
      album: null,
      files: []
    };

    this.onItemClick = this.onItemClick.bind(this);
    this.handleAlbumSelect = this.handleAlbumSelect.bind(this);
  }

  componentDidMount() {
    let nameslug = this.props.routeParams.nameslug;
    this.pageRequest = request.get(`/api/pages/${nameslug}`);
    this.pageRequest.then(response => {
      let data = response.body.result;
      if (response.success) {
        this.setState({
          page: data
        });
      }
    });

    const url = '/api/pages/' + this.props.routeParams.nameslug + '/albums';
    this.albumsRequest = request.get(url);
    this.albumsRequest.then(response => {
      let data = response.body.albums;
      this.setState({
        albums: data
      });
    });
  }

  componentWillUnmount() {
    this.pageRequest.abort();
    this.albumsRequest.abort();
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

  handleAlbumSelect(album) {
    this.setState({
      album
    });
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
          <Col xs={12} md={6} lg={6}>
            <h1>{this.state.page.name}</h1>
            <h4>{this.state.page.address}</h4>
          </Col>
          <Col xs={12} md={6} lg={6}>
            <DropzoneComponent djsConfig={djsConfig}
              config={componentConfig}
              eventHandlers={eventHandlers}
            />
          </Col>
        </Row>
        <Row>
          <Col md={10}>
              <Row>
                <Col md={12}>
                  <h4>Photos</h4>
                </Col>
              </Row>
              <Photos nameslug={this.props.routeParams.nameslug} album={this.state.album} albums={this.state.albums}/>
          </Col>
          <Col md={2}>
            <Row>
              <Col md={12}>
                <h4>Albums</h4>
              </Col>
            </Row>
            <Albums
              albums={this.state.albums}
              handleAlbumSelect={this.handleAlbumSelect}
              nameslug={this.props.routeParams.nameslug}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

Page.propTypes = {
  params: React.PropTypes.object.isRequired,
  routeParams: React.PropTypes.object.isRequired
};

export default Page;
