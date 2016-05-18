import React from 'react';
import $ from 'jquery';

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Button from 'react-bootstrap/lib/Button';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';

class Toolbar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      albumName: ''
    };

    this.onCreateAlbum = this.onCreateAlbum.bind(this);
    this.onSelectExistingAlbum = this.onSelectExistingAlbum.bind(this);
    this.onSetSelected = this.onSetSelected.bind(this);
    this.handleAlbumNameChange = this.handleAlbumNameChange.bind(this);
    this.handleOkAlbum = this.handleOkAlbum.bind(this);
    this.handleCancelAlbum = this.handleCancelAlbum.bind(this);
    this.handleRemoveFromAlbum = this.handleRemoveFromAlbum.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  onCreateAlbum() {
    this.setState({
      creatingAlbum: true,
      existing: false
    });
  }

  onSelectExistingAlbum() {
    this.setState({
      creatingAlbum: true,
      existing: true,
      selected: this.props.albums[0]._id
    });
  }

  onSetSelected(e) {
    this.setState({
      selected: e.target.value
    });
  }

  handleOkAlbum() {
    let albumName = this.state.albumName;
    if (!albumName) {
      albumName = 'Untitled album';
    }
    let query = {
      name: albumName,
      photos: this.props.selectedPhotos
    };
    if (!this.state.existing) {
      let url = '/api/pages/' + this.props.nameslug + '/albums';
      $.post(url, query).done(function (data) {
        if (data.success) {
          console.log(data);
        }
      });
    } else {
      let url = '/api/pages/' + this.props.nameslug + '/albums/' + this.state.selected;
      $.ajax({
        url,
        data: query,
        type: 'PUT',
        success: (response) => {
          console.log(response);
        }
      });
    }
  }

  handleCancelAlbum() {
    this.setState({
      creatingAlbum: false
    });
    this.props.handleCancelAlbum();
  }

  handleAlbumNameChange(e) {
    this.setState({
      albumName: e.target.value
    });
  }

  handleRemoveFromAlbum() {
    const selected = this.props.selectedPhotos;
    const selectedAlbum = this.props.selectedAlbum;
    if (selected && selected.length > 0) {
      let url = '/api/pages/' + this.props.nameslug + '/albums/' + selectedAlbum._id + '?pull=true';
      $.ajax({
        url,
        data: {
          photos: selected
        },
        type: 'PUT',
        success: (response) => {
          console.log(response);
        }
      });
    }
  }

  handleScroll() {
    let scrollTop = event.srcElement.body.scrollTop;
    if (scrollTop > 220) {
      $('div.create-album-toolbar').addClass('fixed-top container');
    } else {
      $('div.create-album-toolbar').removeClass('fixed-top container');
    }
  }

  render() {
    let creatingAlbum = this.state.creatingAlbum;
    let createAlbumButton = '';
    let newAlbumButton = '';
    let hint;
    let form = '';
    let selectedCount = null;
    let noExistingAlbums = !this.props.albums || this.props.albums.length < 1;
    const selectedPhotos = this.props.selectedPhotos;

    if (creatingAlbum) {
      let newAlbumControls = (
        <span>
          {' '}
          <Button
            className='btn btn-success'
            role='button'
            type='button'
            onClick={this.handleOkAlbum}
          >Ok</Button>
          {' '}
          <Button
            className='btn btn-warning'
            role='button'
            type='button'
            onClick={this.handleCancelAlbum}
          >Cancel</Button>
        </span>
      );
      if (!this.state.existing) {
        newAlbumButton = (
          <span>
            <ControlLabel>New Album name</ControlLabel>
            {' '}
            <FormControl
              value={this.state.albumName}
              onChange={this.handleAlbumNameChange}
              placeholder='Untitled album'
              autoFocus
            />
            {newAlbumControls}
          </span>
        );
      } else {
        let albums = this.props.albums;
        let albumsMarkup = albums.map((album) => {
          return (
            <option value={album._id}>{album.name}</option>
          );
        });
        newAlbumButton = (
          <span>
            <ControlLabel>Select an album</ControlLabel>
            {' '}
            <FormControl componentClass='select' placeholder='select' onChange={this.onSetSelected}>
              {albumsMarkup}
            </FormControl>
            {newAlbumControls}
          </span>
        );
      }
    }
    createAlbumButton = (
      <FormGroup>
        <DropdownButton
          title='Add to'
          bsStyle='primary'
          disabled={creatingAlbum}
        >
          <MenuItem onClick={this.onCreateAlbum}>New Album</MenuItem>
          <MenuItem
            onClick={this.onSelectExistingAlbum}
            disabled={noExistingAlbums}
          >Existing Album</MenuItem>
        </DropdownButton>
        {' '}
        {newAlbumButton}
      </FormGroup>
    );
    if (selectedPhotos) {
      selectedCount = selectedPhotos.length;
      if (selectedCount === 1) {
        // createAlbumDisabled = false;
        hint = 'Selected 1 photo.';
      } else if (selectedCount > 1) {
        hint = 'Selected ' + selectedCount + ' photos.';
      }
    }

    if (selectedCount > 0) {
      form = (
        <Form inline>
          {createAlbumButton}
          <div className='pull-right'>
            <Button
              className='btn btn-danger'
              disabled={creatingAlbum}
              onClick={this.handleRemoveFromAlbum}
            >
              <Glyphicon glyph='trash' />
            </Button>
          </div>
        </Form>
      );
    } else {
      form = (
        <p>Select photos you want to organize by clicking on them.</p>
      );
    }

    return (
        <Row className='create-album-toolbar'>
          <Col md={12}>
            {form}
          </Col>
        </Row>
      );
  }
}

Toolbar.propTypes = {
  handleCancelAlbum: React.PropTypes.func.isRequired,
  selectedPhotos: React.PropTypes.object.isRequired,
  selectedAlbum: React.PropTypes.object.isRequired,
  nameslug: React.PropTypes.object.isRequired,
  albums: React.PropTypes.object.isRequired,
  albumPhotos: React.PropTypes.object.isRequired
};

export default Toolbar;
