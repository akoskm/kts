import React from 'react';
import $ from 'jquery';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Photo from './Photo';

class Photos extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      photos: []
    };

    this.onItemClick = this.onItemClick.bind(this);
  }

  componentDidMount() {
    this.serverRequest = $.get('/api/profile/photos', function (response) {
      let data = response.result;
      this.setState({
        _id: data._id,
        photos: data.photos
      });
    }.bind(this));
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  onItemClick(photoid, index) {
    this.state.photos.splice(index, 1);
    this.setState({
      photos: this.state.photos
    });
    return $.ajax({
      url: '/api/profile/photos/' + photoid,
      type: 'DELETE',
      success(response) {
        console.log(response);
      }
    });
  }

  render() {
    let self = this;
    return (
      <div>
        <Row>
          {this.state.photos.map(function (image, i) {
            return (
              <Photo index={i}
                photoid={image._id}
                userid={self.state._id}
                filename={image.filename}
                onItemClick={self.onItemClick}
              />
            );
          })}
        </Row>
      </div>
    );
  }
}

export default Photos;
