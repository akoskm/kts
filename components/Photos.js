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

  onItemClick(i) {
    console.log(i);
  }

  render() {
    let self = this;
    return (
      <div>
        <Row>
          {this.state.photos.map(function (image) {
            let url = '/static/' + self.state._id + '_img/' + image.filename;
            console.log(url);
            return (
              <Photo url={url} onItemClick={self.onItemClick}/>
            );
          })}
        </Row>
      </div>
    );
  }
}

export default Photos;
