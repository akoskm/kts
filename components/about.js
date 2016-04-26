import React from 'react';
import $ from 'jquery';
import Dropzone from 'react-dropzone';

import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class AboutComponent extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      files: []
    };

    this.onDrop = this.onDrop.bind(this);
    this.upload = this.upload.bind(this);
  }

  onDrop(files) {
    let oldFiles = this.state.files.slice();
    oldFiles.push(files);
    this.setState({
      files
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
        data.append(i, value);
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
            submitForm(event, data);
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
          <Button primary onClick={this.upload}>Start upload!</Button>
          <div>
            {this.state.files.map((file) => <img key={file.name} src={file.preview} />)}
          </div>
        </div>
      );
    }
    return (
      <Row>
        <Col xs={12} md={6} lg={6}>
          <h1>A little bit about me:</h1>
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
        <Col xs={12} md={6} lg={6}>
          <form className='uploadZone' onSubmit={this.upload}>
            <Dropzone onDrop={this.onDrop}>
              <div>Try dropping some files here, or click to select files to upload.</div>
            </Dropzone>
            {preview}
          </form>
        </Col>
      </Row>
    );
  }
}

export default AboutComponent;
