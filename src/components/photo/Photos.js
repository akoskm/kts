import React from 'react';
import $ from 'jquery';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
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
    // const photo = this.state.photos.filter((value, i) => {
    //   return i === index;
    // });
    // if (photo && photo.length === 1) {
    //   photo[0].selected = !!photo[0].selected;
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
    const self = this;
    const photos = this.state.photos;
    const nameslug = this.props.nameslug;
    let markup;
    if (photos && photos.length > 0) {
      markup = photos.map((image, i) => {
        let selected = 'nselected';
        if (this.state.selected.indexOf(i) > -1) {
          selected = 'selected';
        }
        return (
          <Photo index={i}
            photoid={image._id}
            name={image.name}
            tags={image.tags}
            nameslug={nameslug}
            filename={image.filename}
            onDeleteClick={self.onDeleteClick}
            onPhotoSelect={self.onPhotoSelect}
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
            <ButtonToolbar>
              <Button>Create Album</Button>
            </ButtonToolbar>
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
