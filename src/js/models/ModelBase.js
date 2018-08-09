import { types } from 'mobx-state-tree';

export default types.compose(
  'ModelBase',
  types.model('ModelBase', {
    id: types.maybe(types.identifier),
    created_at: types.maybeNull(types.Date),
    updated_at: types.maybeNull(types.Date),
  }),
);
