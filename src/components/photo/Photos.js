import React from 'react';
import $ from 'jquery';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import FormGroup from 'react-bootstrap/lib/FormGroup';

import Photo from './Photo';

class Photos extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      photos: [],
      selected: []
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
    if (found > -1) {
      selected.splice(found, 1);
    } else {
      selected.push(index);
    }
    this.setState({
      selected
    });
  }

  render() {
    const photos = this.state.photos;
    const nameslug = this.props.nameslug;
    const selectedPhotos = this.state.selected;
    let createAlbumText = 'Create Album';
    let selectedCount = null;
    let createAlbumDisabled = true;
    if (selectedPhotos) {
      selectedCount = selectedPhotos.length;
      if (selectedCount > 0) {
        createAlbumDisabled = false;
        createAlbumText = createAlbumText + ' (' + selectedCount + ')';
      }
    }
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
        <Row>
          <Col md={12}>
            <FormGroup>
              <ButtonToolbar>
                <Button disabled={createAlbumDisabled}>{createAlbumText}</Button>
              </ButtonToolbar>
            </FormGroup>
          </Col>
        </Row>
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
