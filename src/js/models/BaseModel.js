import {
  types, flow, getRoot, applySnapshot, getParent, getSnapshot,
} from 'mobx-state-tree';

export default types
  .model('BaseModel', {
    id: types.maybe(types.identifier),
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
    /**
     * Fetch full model detail by id
     */
    const fetch = flow(function* fetch() {
      if (self.isLoading) return;
      if (!self.id || !self.apiRoot) throw new Error('Invalid model');

      self.isLoading = true;
      const response = yield self.transport.get(self.apiRoot);
      applySnapshot(self, self.normalize(response.data));

      self.isLoading = false;
      self.isInited = true;
    });

    /**
     * Sync model to server
     * @param {object} data - values will be updated
     */
    const update = flow(function* update(data) {
      if (self.isLoading) return;
      if (!self.id || !self.apiRoot) throw new Error('Invalid model');

      self.isLoading = true;

      const oldSnapshot = getSnapshot(self);
      const newSnapshot = Object.assign({}, oldSnapshot, data);
      try {
        // Assume that this update will be success, calculate optimistic UI,
        // change values directly so that users will think your app loads faster
        applySnapshot(self, newSnapshot);
        const response = yield self.transport.put(self.apiRoot, newSnapshot);

        // Change computed values returned from server
        applySnapshot(self, self.normalize(response.data));
        self.isLoading = false;
      } catch (err) {
        // Rollback if error occurs
        console.error(err);
        applySnapshot(self, oldSnapshot);
      }
    });

    /**
     * Delete a model, then remove it from state tree
     */
    const remove = flow(function* remove() {
      yield self.transport.delete(self.apiRoot);
      getParent(self, 2).remove(self);
    });

    return { fetch, update, remove };
  });
