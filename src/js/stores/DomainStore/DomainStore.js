import { reaction } from 'mobx';
import { types, getParent } from 'mobx-state-tree';

import _forOwn from 'lodash/forOwn';

import UserStore from '../UserStore';

const DomainStore = types
  .model('DomainStore', {
    userStore: types.optional(UserStore, {}),
  })
  .actions((self) => {
    const init = () => {
      const {
        routingStore: { browserHistory },
      } = getParent(self).uiStore;

      // Listen on browser history and invoke init function of model stores
      // whenever router location matches one of store's init pathnames
      browserHistory.listen((location) => {
        _forOwn(self, (store) => {
          if (Array.isArray(store.initPathnames)) {
            const isMatched = store.initPathnames.reduce(
              (acc, pathname) => location.pathname.indexOf(pathname) !== -1 || acc,
              false,
            );

            if (isMatched && store.init instanceof Function) {
              store.init();
            }
          } else if (store.initPathnames && location.pathname.indexOf(store.initPathnames) !== -1) {
            if (store.init instanceof Function) {
              store.init();
            }
          }
        });
      });
    };

    const afterAttach = () => {
      self.init();

      // Observe token and re-init store after token changed (login, logout actions)
      const { sessionStore } = getParent(self).uiStore;
      reaction(() => sessionStore.token, self.init);
    };

    return {
      afterAttach,
      init,
    };
  });

export default DomainStore;
