import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Image from 'react-bootstrap/lib/Image';
import Select from 'react-select';

class Photo extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      tags: []
    };

    this._onClick = this._onClick.bind(this);
    this._handleSelectChange = this._handleSelectChange.bind(this);
  }

  _onClick() {
    this.props.onItemClick(this.props.photoid, this.props.index);
  }

  _handleSelectChange(value) {
    this.setState({ tags: value });
  }

  render() {
    let url = '/static/' + this.props.nameslug + '_img/' + this.props.filename;
    return (
      <Col xd={3} md={3} lg={3}>
        <div className='thumbnail'>
          <Image src={url}/>
        </div>
        <div className='caption'>
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
          <p>
            <Button onClick={this._onClick}
              className='btn btn-primary'
              role='button'
              type='button'
            >
              Delete
            </Button>
          </p>
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
  onItemClick: React.PropTypes.object.isRequired
};

export default Photo;
