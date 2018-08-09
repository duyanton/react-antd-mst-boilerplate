import { types, flow, getRoot, applySnapshot, getParent } from 'mobx-state-tree';

export default types
  .model('BaseModel', {
    id: types.maybe(types.identifier),
    created_at: types.maybeNull(types.Date),
    updated_at: types.maybeNull(types.Date),
  })
  .views(self => ({
    // Expose transport method so any stores composed with this base model can use
    get transport() {
      return getRoot(self).uiStore.transport;
    },
    // Combine from model store with this object id
    // Eg: /users/1
    get apiRoot() {
      return `${getParent(self, 2).apiRoot}/${self.id}`;
    },
    // Normalize function from model store, call before apply snapshot
    get normalize() {
      return getParent(self, 2).normalize;
    },
  }))
  .volatile(() => ({
    isLoading: false,
    isInited: false,
  }))
  .actions((self) => {
    // Fetch full object detail by id and set isInited flag to true
    const fetch = flow(function* fetch() {
      if (self.isLoading) return;
      if (!self.id || !self.apiRoot) throw new Error('Invalid model');

      self.isLoading = true;
      const response = yield self.transport.get(self.apiRoot);
      applySnapshot(self, self.normalize(response.data));

      self.isLoading = false;
      self.isInited = true;
    });

    return { fetch };
  });
