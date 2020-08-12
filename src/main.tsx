import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import { App } from './app';


// loading general styles and fonts
import './general-styles.scss';
import { store, history } from 'app/store';


// prepare store
ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale="en">
      <ConnectedRouter history={history} store={store}>
        <App />
      </ConnectedRouter>
    </IntlProvider>
  </Provider>,
  document.getElementById('root')
);
