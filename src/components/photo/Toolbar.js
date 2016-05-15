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

import Photo from './Photo';

class Toolbar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      albumName: ''
    };

    this.onCreateAlbum = this.onCreateAlbum.bind(this);
    this.handleAlbumNameChange = this.handleAlbumNameChange.bind(this);
    this.handleOkAlbum = this.handleOkAlbum.bind(this);
    this.handleCancelAlbum = this.handleCancelAlbum.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  onCreateAlbum() {
    this.setState({
      creatingAlbum: true,
      albumName: 'Untitled Album'
    });
  }

  handleOkAlbum() {
    let query = {
      name: this.state.albumName,
      photos: this.props.selectedPhotos
    };
    $.post('/api/pages/' + this.props.nameslug + '/albums', query).done(function (data) {
      if (data.success) {
        console.log(data);
      }
    });
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
    let selectedCount = null;
    const selectedPhotos = this.props.selectedPhotos;

    if (creatingAlbum) {
      hint = 'Select photos you want to add to the album by clicking on them, then click on OK';
      newAlbumButton = (
        <FormGroup>
          <ControlLabel>Album name</ControlLabel>
          {' '}
          <FormControl value={this.state.albumName} onChange={this.handleAlbumNameChange}/>
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
        </FormGroup>
      );
    } else {
      createAlbumButton = (
        <Button
          className='btn btn-primary'
          disabled={creatingAlbum}
          onClick={this.onCreateAlbum}
        >
          Create Album
        </Button>
      );
    }
    if (selectedPhotos) {
      selectedCount = selectedPhotos.length;
      if (selectedCount === 1) {
        // createAlbumDisabled = false;
        hint = 'Selected 1 photo.';
      } else if (selectedCount > 1) {
        hint = 'Selected ' + selectedCount + ' photos.';
      }
    }

    return (
      <Row className='create-album-toolbar'>
        <Col md={12}>
          <FormGroup>
            <Form inline>
              {createAlbumButton}
              {' '}
              <p>{hint}</p>
              {' '}
              <div className='pull-right'>
                {newAlbumButton}
              </div>
            </Form>
          </FormGroup>
        </Col>
      </Row>
    );
  }
}

Toolbar.propTypes = {
  handleCancelAlbum: React.PropTypes.func.isRequired,
  selectedPhotos: React.PropTypes.object.isRequired,
  nameslug: React.PropTypes.object.isRequired
};

export default Toolbar;
