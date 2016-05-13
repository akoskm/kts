import ReactDOM from 'react-dom';
import React from 'react';
import $ from 'jquery';
import DropzoneComponent from 'react-dropzone-component';

import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import Photos from './Photos';
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
    let callbackArray = [
      function () {
        console.log('Look Ma, I\'m a callback in an array!');
      },
      function () {
        console.log('Wooooow!');
      }
    ];
    let eventHandlers = {
      // All of these receive the event as first parameter:
      drop: callbackArray
    };
    let componentConfig = {
      iconFiletypes: ['.jpg', '.png', '.gif'],
      showFiletypeIcon: true,
      postUrl: '/api/profile/img'
    };

    let djsConfig = {
      addRemoveLinks: true,
      acceptedFiles: 'image/jpeg,image/png,image/gif'
    };

    return (
      <div>
        <Row>
          <Col xs={12} md={6} lg={6}>
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
            <DropzoneComponent djsConfig={djsConfig}
              config={componentConfig}
              eventHandlers={eventHandlers}
            />
          </Col>
        </Row>
        <Photos />
      </div>
    );
  }
}

export default AboutComponent;
