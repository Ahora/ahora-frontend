import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import { App } from './app';
import { store, history } from 'app/store';
import './general-styles.scss';

// prepare store
ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history} store={store}>
      <App />
    </ConnectedRouter>
  </Provider>,

  document.getElementById('root')
);
