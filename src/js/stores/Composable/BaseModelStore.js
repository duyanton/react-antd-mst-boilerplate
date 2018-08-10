import { types, getRoot } from 'mobx-state-tree';

/**
 * A base model store, can be composed to create any store,
 * this can be used at an abstraction, sharing data can go here
 */
const BaseModelStore = types
  .model('BaseModelStore', {})
  .views(self => ({
    // Expose transport method so any stores composed with this can use
    get transport() {
      return getRoot(self).uiStore.transport;
    },
  }))
  .actions((self) => {
    let timeout;

    // Function to initialize this store
    // Everything that need to do first, eg: hydrate data, load contents,... can go here
    const init = () => {
      if (!self.isInited) {
        if (self.load && self.load instanceof Function) {
          self.load();
        }
      }
    };

    // Inheritance by using type composition
    const load = () => {};

    // Debounce load function through reload method
    const reload = () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        if (self.load && self.load instanceof Function) {
          self.load();
        }
      }, 250);
    };

    return {
      init,
      load,
      reload,
    };
  });

export default BaseModelStore;
