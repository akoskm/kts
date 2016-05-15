import React from 'react';
import $ from 'jquery';

import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';

import Album from './Album';

class Albums extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      albums: [],
      selected: null
    };

    this.handleAlbumSelect = this.handleAlbumSelect.bind(this);
  }

  componentDidMount() {
    const url = '/api/pages/' + this.props.nameslug + '/albums';
    this.serverRequest = $.get(url, (response) => {
      let data = response.albums;
      this.setState({
        albums: data
      });
    });
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
    let albums = this.state.albums;
    if (albums.length > 0) {
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
  handleAlbumSelect: React.PropTypes.object.isRequired
};

export default Albums;
