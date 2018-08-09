import { reaction } from 'mobx';
import { types } from 'mobx-state-tree';

import { browserHistory } from 'react-router';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';

import config from '../../config';

import RestTransport from '../../utils/transport';

import SessionStore from '../SessionStore';
import RoutingStore from '../RoutingStore';
import LocaleStore from '../LocaleStore';

const routerStore = new RouterStore();
const enhancedBrowserHistory = syncHistoryWithStore(browserHistory, routerStore);

const UIStore = types
  .model('UIStore', {
    /**
     * Session store to handle user's authentication
     * Will do actions like sign up, login, forgot password,...
     * also perform read, write JWT token to cookie
     */
    sessionStore: types.optional(SessionStore, {}),

    /**
     * Axios instance to handle Rest API,
     * will reference to session store with token to authenticate
     */
    transport: types.optional(types.frozen(), {}),

    /**
     * Routing store with enhanced browser history
     * Wrap react-router's browser history with Mobx to use Mobx observable power
     */
    routingStore: types.optional(RoutingStore, {
      browserHistory: enhancedBrowserHistory,
    }),

    /**
     * Locale store will handle i18n for our app
     * Parse locale user language and set locale messages data
     */
    localeStore: types.optional(LocaleStore, {}),
  })
  .actions((self) => {
    const initTransport = () => {
      self.transport = new RestTransport({
        baseURL: config.API_URL,
        timeout: 100000,
        token: self.sessionStore.token,
        handleUnauthorized: self.sessionStore.logout,
      });
    };

    const afterCreate = () => {
      self.initTransport();
      reaction(() => self.sessionStore.token, self.initTransport);
    };

    return {
      afterCreate,
      initTransport,
    };
  });

export default UIStore;
