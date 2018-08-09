import { types } from 'mobx-state-tree';

import ModelBase from './ModelBase';

const User = types.compose(
  'User',
  ModelBase,
  types.model({
    full_name: types.optional(types.string, ''),
    email: types.optional(types.string, ''),
  }),
);

export default User;
