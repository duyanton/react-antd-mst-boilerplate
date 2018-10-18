import { values } from 'mobx';
import {
  types, flow, detach, isStateTreeNode,
} from 'mobx-state-tree';

import BaseModelStore from '../Composable/BaseModelStore';
import Pagination from '../Composable/Pagination';
import User from '../../models/User';

const UserStore = types.compose(
  'UserStore',
  BaseModelStore,
  types
    .model({
      // Store all users data
      users: types.map(User),
      pagination: types.optional(Pagination, {
        currentPage: 1,
        limit: 20,
      }),

      // To keep results of pagination, filter, sorting,...
      usersFromResponse: types.array(types.reference(User)),
    })
    .views(self => ({
      get userList() {
        return values(self.users);
      },
    }))
    .volatile(() => ({
      // If router location matches one of these pathnames
      // init function will be invoked
      initPathnames: ['/users'],

      // API endpoint
      apiRoot: '/users',

      isInited: false,
      isLoading: false,
    }))
    .actions((self) => {
      /**
       * If we need to transform nested JSON object, keep reference, merge array node, etc...
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
          const { page, limit } = self.pagination;
          const { data, headers } = yield self.transport.get(
            `${self.apiRoot}?_page=${page}&_limit=${limit}`,
          );

          // Save total users to pagination
          if (headers['x-total-count']) {
            self.pagination.total = Number(headers['x-total-count']);
          }

          // Put all users from response to users map
          data.forEach((user) => {
            self.add(user);
          });

          // Save temporary users from response by using reference to users node
          self.usersFromResponse = data.map(user => user.id);
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

      /**
       * Remove a node from state tree
       * @param {object} node - MST node to be removed
       */
      const remove = (node) => {
        if (!isStateTreeNode(node)) return;

        // Clear all references to this node before detach
        self.usersFromResponse = self.usersFromResponse.filter(item => item.id !== node.id);
        detach(node);
      };

      return {
        add,
        getById,
        load,
        normalize,
        remove,
      };
    }),
);

export default UserStore;
