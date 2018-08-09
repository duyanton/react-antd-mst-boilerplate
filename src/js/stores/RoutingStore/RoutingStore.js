import { types } from 'mobx-state-tree';

const RoutingStore = types.model('RoutingStore', {
  browserHistory: types.frozen(),
});

export default RoutingStore;
