import React from 'react';

import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

class ListItem extends React.Component {

  constructor(props) {
    super(props);
    this._onClick = this._onClick.bind(this);
  }

  _onClick() {
    this.props.onItemClick(this.props.index);
  }

  render() {
    let file = this.props.item;
    return (
      <Col xd={4} md={4} lg={4}>
        <div className='thumbnail'>
          <img  key={file.name} src={file.preview} />
        </div>
        <div className='caption'>
          {file.name}
          <p>
            <button onClick={this._onClick}
              className='btn btn-primary'
              role='button'
              type='button'
            >
              Remove
            </button>
          </p>
        </div>
      </Col>
    );
  }
}

ListItem.propTypes = {
  item: React.PropTypes.object.isRequired,
  index: React.PropTypes.object.isRequired,
  onItemClick: React.PropTypes.object.isRequired
};

export default ListItem;
