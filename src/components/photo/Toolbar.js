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
      newAlbumName: ''
    };

    this.onCreateAlbum = this.onCreateAlbum.bind(this);
    this.handleAlbumNameChange = this.handleAlbumNameChange.bind(this);
    this.handleOkAlbum = this.handleOkAlbum.bind(this);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  onCreateAlbum() {
    this.setState({
      newAlbumName: 'Untitled Album'
    });
  }

  handleOkAlbum() {
    console.log(this.state.newAlbumName);
  }

  handleAlbumNameChange(e) {
    this.setState({
      newAlbumName: e.target.value
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
    let creatingAlbum = false;
    let newAlbumButton = '';
    let createAlbumText;
    let selectedCount = null;
    const selectedPhotos = this.props.selectedPhotos;

    if (this.state.newAlbumName) {
      creatingAlbum = true;
      createAlbumText = 'Select photos you want to add to the album by clicking on them.';
      newAlbumButton = (
        <FormGroup>
          <ControlLabel>Album name</ControlLabel>
          {' '}
          <FormControl value={this.state.newAlbumName} onChange={this.handleAlbumNameChange}/>
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
          >Cancel</Button>
        </FormGroup>
      );
    }

    if (selectedPhotos) {
      selectedCount = selectedPhotos.length;
      if (selectedCount === 1) {
        // createAlbumDisabled = false;
        createAlbumText = 'Selected 1 photo.';
      } else if (selectedCount > 1) {
        createAlbumText = 'Selected ' + selectedCount + ' photos.';
      }
    }

    return (
      <Row className='create-album-toolbar'>
        <Col md={12}>
          <FormGroup>
            <Form inline>
              <Button
                className='btn btn-primary'
                disabled={creatingAlbum}
                onClick={this.onCreateAlbum}
              >
                Create Album
              </Button>
              {' '}
              {createAlbumText}
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
  selectedPhotos: React.PropTypes.object.isRequired
};

export default Toolbar;
