import React from 'react';
import $ from 'jquery';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Image from 'react-bootstrap/lib/Image';

class Images extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      images: []
    };
  }

  componentDidMount() {
    this.serverRequest = $.get('/api/profile/images', function (response) {
      let data = response.result;
      this.setState({
        _id: data._id,
        images: data.images
      });
    }.bind(this));
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  render() {
    let self = this;
    return (
      <div>
        <Row>
          {this.state.images.map(function (image) {
            let url = '/static/' + self.state._id + '_img/' + image.filename;
            console.log(url);
            return (
              <Col xs={6} md={4} lg={4}>
                <Image src={url} thumbnail/>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}

export default Images;
