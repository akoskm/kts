import React from 'react';

import ListGroup from 'react-bootstrap/lib/ListGroup';

import Album from './Album';

class Albums extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selected: null
    };

    this.handleAlbumSelect = this.handleAlbumSelect.bind(this);
  }

  handleAlbumSelect(album) {
    let newAlbumState = album;
    if (this.state.selected && this.state.selected._id === album._id) {
      newAlbumState = null;
    }
    this.setState({
      selected: newAlbumState
    });
    this.props.handleAlbumSelect(newAlbumState);
  }

  render() {
    let markup = 'No Albums found.';
    let albums = this.props.albums;
    if (albums && albums.length > 0) {
      markup = albums.map((album) => {
        let active = false;
        if (this.state.selected) {
          active = album._id === this.state.selected._id;
        }
        return (
          <Album handleAlbumSelect={this.handleAlbumSelect} album={album} active={active}/>
        );
      });
    }
    return (
      <ListGroup>
        {markup}
      </ListGroup>
    );
  }
}

Albums.propTypes = {
  nameslug: React.PropTypes.object.isRequired,
  albums: React.PropTypes.object.isRequired,
  handleAlbumSelect: React.PropTypes.object.isRequired
};

export default Albums;
