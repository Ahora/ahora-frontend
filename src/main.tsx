import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { ConnectedRouter } from 'react-router-redux';
import { Provider } from 'react-redux';
import { App } from './app';
import { ConfigProvider } from 'antd';
import { store, history } from 'app/store';
import localMap from './Internationalization';

import './general-styles.scss';

const tolat: any = localMap.he;

// prepare store
ReactDOM.render(
  <Provider store={store}>

    <ConfigProvider direction="ltr">
      <IntlProvider messages={tolat} locale="he" defaultLocale="en">
        <ConnectedRouter history={history} store={store}>
          <App />
        </ConnectedRouter>
      </IntlProvider>
    </ConfigProvider>
  </Provider>,

  document.getElementById('root')
);
