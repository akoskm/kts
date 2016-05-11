import React from 'react';
import $ from 'jquery';

class PageComponent extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      page: JSON.parse(this.props.params.context || process.APP_STATE) || {}
    };
  }

  componentDidMount() {
    let nameslug = this.props.routeParams.nameslug;
    this.serverRequest = $.get('/api/pages/' + nameslug, function (response) {
      let data = response.result;
      this.setState({
        page: data
      });
    }.bind(this));
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  render() {
    return (
      <h1>{this.state.page.name}</h1>
    );
  }
}

PageComponent.propTypes = {
  params: React.PropTypes.object.isRequired,
  routeParams: React.PropTypes.object.isRequired
};

export default PageComponent;
