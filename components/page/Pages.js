import React from 'react';
import $ from 'jquery';

class Pages extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pages: []
    };
  }

  componentDidMount() {
    this.serverRequest = $.get('/api/pages', function (response) {
      let data = response.result;
      this.setState({
        pages: data
      });
    }.bind(this));
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  render() {
    console.log(this.state);
    return (
      <div>
        <h4>Your Pages</h4>
        {this.state.pages.map(function (page, i) {
          return (
            <div>
              <a index={i}
                href={'/' + page.nameslug}
              >
              {page.name}
              </a>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Pages;
