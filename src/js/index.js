import { hot } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';

import { injectGlobal } from 'emotion';
import { Provider } from 'mobx-react';
import { IntlProvider } from 'react-intl';

import { configure } from 'mobx';

import registerServiceWorker from './registerServiceWorker';

import Routes from './routes';

import stores from './stores';

import '../css/index.less';

configure({ enforceActions: 'strict' });

injectGlobal`
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,400i,500,700');
  body {
    height: 100%;
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;

    #root {
      height: 100%;
    }
  }
`;

const Application = hot(module)(() => (
  <Provider
    {...stores}
    {...stores.domainStore}
    {...stores.uiStore}
    router={stores.uiStore.routingStore.browserHistory}
  >
    <IntlProvider
      locale={stores.uiStore.localeStore.language}
      messages={stores.uiStore.localeStore.messages}
    >
      <Routes />
    </IntlProvider>
  </Provider>
));

ReactDOM.render(<Application />, document.getElementById('root'));
registerServiceWorker();
