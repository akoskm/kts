import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import MainComponent from './components/Main';

import './styles/scss/style.scss';
import 'react-flexgrid/lib/flexgrid.css';
import 'bootstrap/less/bootstrap.less';
import 'react-dropzone-component/styles/filepicker.css';
import 'react-dropzone-component/example/styles/example.css';
import 'dropzone/dist/dropzone.css';
import 'react-select/dist/react-select.css';

ReactDOM.render(
  <AppContainer>
    <MainComponent />
  </AppContainer>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept('./components/Main', () => {
    const NextMain = require('./components/Main').default;
    ReactDOM.render(
      <AppContainer>
        <NextMain />
      </AppContainer>,
      document.getElementById('app')
    );
  });
}
