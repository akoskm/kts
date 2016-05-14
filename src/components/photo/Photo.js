import React from 'react';
import $ from 'jquery';

import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import Image from 'react-bootstrap/lib/Image';

import Select from 'react-select';

class Photo extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: this.props.name,
      tags: this.props.tags
    };

    this._onDelete = this._onDelete.bind(this);
    this._onPhotoSelect = this._onPhotoSelect.bind(this);
    this._onSave = this._onSave.bind(this);
    this._handleSelectChange = this._handleSelectChange.bind(this);
    this._handleNameChange = this._handleNameChange.bind(this);
  }

  _onSave() {
    $.ajax({
      url: '/api/pages/' + this.props.nameslug + '/photos/' + this.props.photoid,
      data: this.state,
      type: 'PUT',
      success: (response) => {
        console.log(response);
      }
    });
  }

  _onDelete(e) {
    this.props.onDeleteClick(this.props.photoid, this.props.index);
  }

  _onPhotoSelect() {
    this.props.onPhotoSelect(this.props.photoid, this.props.index);
  }

  _handleSelectChange(value) {
    this.setState({ tags: value });
  }

  _handleNameChange(e) {
    this.setState({
      name: e.target.value
    });
  }

  render() {
    const url = '/static/' + this.props.nameslug + '_img/' + this.props.filename;
    const className = 'thumbnail ' + this.props.className;
    return (
      <Col xs={12} md={3} lg={3}>
        <div className={className}>
          <Image src={url} onClick={this._onPhotoSelect}/>
          <div className='caption'>
            <FormGroup>
              <ControlLabel>Name</ControlLabel>
              <FormControl
                type='text'
                value={this.state.name}
                onChange={this._handleNameChange}
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Tags</ControlLabel>
              <Select
                multi
                value={this.state.tags}
                placeholder='Select your tags'
                onChange={this._handleSelectChange}
                options={[
                  { value: 'one', label: 'One' },
                  { value: 'two', label: 'Two' },
                  { value: 'three', label: 'Three' },
                  { value: 'four', label: 'Four' },
                  { value: 'five', label: 'Five' }
                ]}
              />
            </FormGroup>
            <ButtonToolbar>
              <Button
                onClick={this._onSave}
                className='btn btn-primary'
                role='button'
                type='button'
              >
                Save
              </Button>
              <Button onClick={this._onDelete}
                className='btn btn-danger'
                role='button'
                type='button'
              >
                Delete
              </Button>
            </ButtonToolbar>
          </div>
        </div>
      </Col>
    );
  }
}

Photo.propTypes = {
  nameslug: React.PropTypes.object.isRequired,
  filename: React.PropTypes.object.isRequired,
  index: React.PropTypes.object.isRequired,
  photoid: React.PropTypes.object.isRequired,
  onDeleteClick: React.PropTypes.func.isRequired,
  onPhotoSelect: React.PropTypes.func.isRequired,
  tags: React.PropTypes.object.isRequired,
  name: React.PropTypes.object.isRequired,
  className: React.PropTypes.object.isRequired
};

export default Photo;
