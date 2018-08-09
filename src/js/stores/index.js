import { types } from 'mobx-state-tree';
import makeInspectable from 'mobx-devtools-mst';

import UIStore from './UIStore';
import DomainStore from './DomainStore';

const RootStore = types.model('RootStore', {
  /**
   * Contains application specific domain data like users, companies, etc...
   */
  domainStore: types.optional(DomainStore, {}),

  /**
   * Session, JWT token, router, language,...
   * States that usually all applications will have
   */
  uiStore: types.optional(UIStore, {}),
});

const rootStore = RootStore.create({});

if (process.env.NODE_ENV === 'development') {
  makeInspectable(rootStore);
}

export default rootStore;
