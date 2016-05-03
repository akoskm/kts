import React from 'react';
import $ from 'jquery';
import Dropzone from 'react-dropzone';

import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import ListItem from './ListItem';

class AboutComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      files: []
    };

    this.onDrop = this.onDrop.bind(this);
    this.upload = this.upload.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
  }

  onDrop(files) {
    let oldFiles = this.state.files.slice();
    oldFiles.push(files);
    this.setState({
      files
    });
  }

  onItemClick(i) {
    this.state.files.splice(i, 1);
    this.setState({
      files: this.state.files
    });
  }

  upload() {
    let submitForm = function (event, data) {
      // Create a jQuery object from the form
      let $form = $(event.target);

      // Serialize the form data
      let formData = $form.serialize();

      // You should sterilise the file names
      $.each(data.files, function (key, value) {
        formData = formData + '&filenames[]=' + value;
      });

      $.ajax({
        url: '/api/profile/img',
        type: 'POST',
        data: formData,
        cache: false,
        dataType: 'json',
        success(data, textStatus, jqXHR) {
          if (typeof data.error === 'undefined') {
            // Success so call function to process the form
            console.log('SUCCESS: ' + data.success);
          } else {
            // Handle errors here
            console.log('ERRORS: ' + data.error);
          }
        },
        error(jqXHR, textStatus, errorThrown) {
          // Handle errors here
          console.log('ERRORS: ' + textStatus);
        },
        complete() {
          // STOP LOADING SPINNER
        }
      });
    };

    let data = new FormData();
    let files = this.state.files;
    if (files && files.length > 0) {
      this.state.files.forEach(function (value, i) {
        data.append('photo', value);
      });
      $.ajax({
        url: '/api/profile/img',
        type: 'POST',
        data,
        cache: false,
        dataType: 'json',
        processData: false,
        contentType: false,
        success(data, textStatus, jqXHR) {
          if (typeof data.error === 'undefined') {
            // Success so call function to process the form
            // submitForm(event, data);
            console.log('uploaded');
          } else {
            // Handle errors here
            console.log('ERRORS: ' + data.error);
          }
        },
        error(jqXHR, textStatus, errorThrown) {
          // Handle errors here
          console.log('ERRORS: ' + textStatus);
          // STOP LOADING SPINNER
        }
      });
    } else {
      alert('nothing to upload!');
    }
  }

  render() {
    let preview;
    if (this.state.files.length > 0) {
      preview = (
        <div>
          <p>{this.state.files.length} to upload...</p>
          <Row>
            <Col xd={12} md={12} lg={12}>
              <div className='form-group'>
                <Button primary onClick={this.upload}>Start upload!</Button>
              </div>
            </Col>
          </Row>
          <Row>
            {
              this.state.files.map((file, i) =>
                <ListItem key={file.name} index={i} item={file}
                  onItemClick={this.onItemClick}
                />
              )
            }
          </Row>
        </div>
      );
    }
    return (
      <div>
        <Row>
          <Col xs={12} md={6} lg={6}>
            <h1>Profile:</h1>
            <div>
              <Input
                type='text'
                placeholder='Short Name'
              />
              <Input
                type='text'
                placeholder='Default Value'
              />
              <Input
                type='textarea'
                placeholder='Address comes here'
                rows={2}
                rowsMax={4}
              /><br/>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={12} lg={12}>
            <form className='uploadZone' onSubmit={this.upload}>
              <Dropzone ref='photo' onDrop={this.onDrop}>
                <div>Try dropping some files here, or click to select files to upload.</div>
              </Dropzone>
              {preview}
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AboutComponent;
