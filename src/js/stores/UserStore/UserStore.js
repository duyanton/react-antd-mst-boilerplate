import { values } from 'mobx';
import { types, flow, detach } from 'mobx-state-tree';

import BaseModelStore from '../BaseModelStore';
import User from '../../models/User';

const UserStore = types.compose(
  'UserStore',
  BaseModelStore,
  types
    .model({
      users: types.map(User),
    })
    .views(self => ({
      get userList() {
        return values(self.users);
      },
    }))
    .volatile(() => ({
      apiRoot: '/users',

      // If router location matches one of these pathnames
      // init function will be invoked
      initPathnames: ['/users'],
    }))
    .actions((self) => {
      /**
       * If we need to transform nested JSON object, keep reference, merger array node, etc...
       * @param {object} snapshot - user snapshot
       */
      const normalize = snapshot => snapshot;

      /**
       * Add a new user to users map node
       * @param {object} user - user snapshot
       */
      const add = (user) => {
        if (!user || !user.id) return undefined;

        return self.users.put(normalize(user));
      };

      /**
       * Fetch list of users from server
       */
      const load = flow(function* load() {
        if (self.isLoading) return;
        self.isLoading = true;

        try {
          const response = yield self.transport.get(`${self.apiRoot}?_page=1&_limit=20`);

          response.data.forEach((user) => {
            self.add(user);
          });
        } catch (err) {
          console.error(err);
        } finally {
          self.isInited = true;
          self.isLoading = false;
        }
      });

      /**
       * Get a user by id
       * @param {string} id - user id
       */
      const getById = (id) => {
        if (!id) return undefined;

        // Get from map if already have
        if (self.users.has(id)) {
          return self.users.get(id);
        }

        // Otherwise fetch from server
        // First, create new state tree node with this id
        self.add({ id });
        const user = self.users.get(id);

        try {
          // Then, try fetch to fetch it
          user.fetch();
          return user;
        } catch (err) {
          // Rollback, detach this node if error
          console.error(err);
          detach(user);
          return undefined;
        }
      };

      return {
        add,
        getById,
        load,
        normalize,
      };
    }),
);

export default UserStore;
