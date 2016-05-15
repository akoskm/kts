import React from 'react';
import $ from 'jquery';

import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';

class Album extends React.Component {

  constructor(props) {
    super(props);

    this.handleAlbumSelect = this.handleAlbumSelect.bind(this);
  }

  handleAlbumSelect() {
    this.props.handleAlbumSelect(this.props.album);
  }

  render() {
    return (
      <ListGroupItem
        onClick={this.handleAlbumSelect}
        active={this.props.active}
      >
        {this.props.album.name}
      </ListGroupItem>
    );
  }
}

Album.propTypes = {
  handleAlbumSelect: React.PropTypes.func.isRequired,
  active: React.PropTypes.object.isRequired,
  album: React.PropTypes.object.isRequired
};

export default Album;
