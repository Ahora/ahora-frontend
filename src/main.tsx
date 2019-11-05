import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IntlProvider  } from 'react-intl';

import { App } from './app';

// loading general styles and fonts
import './general-styles.scss';

const messages_en = require("./translations/en.json");
const messages_es = require("./translations/es.json");
const messages: { [id: string] : any } = {  
  'en': messages_en,
  'es': messages_es
};
let language = navigator.language.split(/[-_]/)[0]; // language without region code  
if (!messages[language]) {
  language = 'en';
}

// prepare store
ReactDOM.render(  
  <IntlProvider locale={language} messages={messages[language]}>
      <App />
  </IntlProvider>,
  document.getElementById('root')
);
