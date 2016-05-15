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
  }

  componentDidMount() {
    const nameslug = this.props.nameslug;
    this.serverRequest = $.get('/api/pages/' + nameslug + '/photos', (response) => {
      const data = response.result;
      if (response.success && data) {
        this.setState({
          _id: data._id,
          photos: data.photos
        });
      }
    });
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  onDeleteClick(photoid, index) {
    const nameslug = this.props.nameslug;
    this.state.photos.splice(index, 1);
    this.setState({
      photos: this.state.photos
    });
    return $.ajax({
      url: '/api/pages/' + nameslug + '/photos/' + photoid,
      type: 'DELETE',
      success(response) {
        console.log(response);
      }
    });
  }

  onPhotoSelect(photoid, index) {
    const selected = this.state.selected;
    const found = selected.indexOf(index);
    let newAlbumName = this.state.newAlbumName;
    if (found > -1) {
      selected.splice(found, 1);
      if (selected.length === 0) {
        newAlbumName = null;
      }
    } else {
      selected.push(index);
    }
    this.setState({
      selected,
      newAlbumName
    });
  }

  render() {
    const photos = this.state.photos;
    const nameslug = this.props.nameslug;
    const selectedPhotos = this.state.selected;

    let markup;
    if (photos && photos.length > 0) {
      markup = photos.map((image, i) => {
        let selected = '';
        if (selectedPhotos && selectedPhotos.length > 0) {
          if (selectedPhotos.indexOf(i) > -1) {
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
        <Toolbar selectedPhotos={this.state.selected}/>
        <Row>
          {markup}
        </Row>
      </div>
    );
  }
}

Photos.propTypes = {
  nameslug: React.PropTypes.object.isRequired
};

export default Photos;
