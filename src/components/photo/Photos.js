import React from 'react';
import $ from 'jquery';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import Photo from './Photo';
import Toolbar from './Toolbar';

class Photos extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      photos: [],
      selected: [],
      toolbarClass: 'inline create-album-toolbar'
    };

    this.onDeleteClick = this.onDeleteClick.bind(this);
    this.onPhotoSelect = this.onPhotoSelect.bind(this);
    this.handleCancelAlbum = this.handleCancelAlbum.bind(this);
  }

  componentDidMount() {
    const nameslug = this.props.nameslug;
    this.serverRequest = $.get('/api/pages/' + nameslug + '/photos', (response) => {
      const data = response.result;
      if (response.success && data) {
        this.setState({
          photos: data
        });
      }
    });
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  onDeleteClick(photoid) {
    const nameslug = this.props.nameslug;
    let photos = this.state.photos.filter(element => {
      return element._id !== photoid;
    });
    this.setState({
      photos
    });
    return $.ajax({
      url: '/api/pages/' + nameslug + '/photos/' + photoid,
      type: 'DELETE',
      success(response) {
        console.log(response);
      }
    });
  }

  onPhotoSelect(photoid) {
    const selected = this.state.selected;
    const found = selected.indexOf(photoid);
    if (found > -1) {
      selected.splice(found, 1);
    } else {
      selected.push(photoid);
    }
    this.setState({
      selected
    });
  }

  handleCancelAlbum() {
    this.setState({
      selected: []
    });
  }

  render() {
    let photos = this.state.photos;
    const album = this.props.album;
    const nameslug = this.props.nameslug;
    const selectedPhotos = this.state.selected;

    if (album) {
      photos = photos.filter((photo) => {
        return album.photos.indexOf(photo._id) > -1;
      });
    }

    let markup;
    if (photos && photos.length > 0) {
      markup = photos.map((image, i) => {
        let selected = '';
        if (selectedPhotos && selectedPhotos.length > 0) {
          if (selectedPhotos.indexOf(image._id) > -1) {
            selected = 'selected';
          } else {
            selected = 'nselected';
          }
        }
        return (
          <Photo index={i}
            photoid={image._id}
            name={image.name}
            tags={image.tags}
            nameslug={nameslug}
            filename={image.filename}
            onDeleteClick={this.onDeleteClick}
            onPhotoSelect={this.onPhotoSelect}
            className={selected}
          />
        );
      });
    } else {
      markup = <Col md={12}>No Photos found.</Col>;
    }
    return (
      <div>
        <Toolbar
          nameslug={nameslug}
          albums={this.props.albums}
          albumPhotos={photos}
          selectedAlbum={album}
          selectedPhotos={this.state.selected}
          handleCancelAlbum={this.handleCancelAlbum}
        />
        <Row>
          {markup}
        </Row>
      </div>
    );
  }
}

Photos.propTypes = {
  nameslug: React.PropTypes.object.isRequired,
  albums: React.PropTypes.object.isRequired,
  album: React.PropTypes.object.isRequired
};

export default Photos;
