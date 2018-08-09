import { types } from 'mobx-state-tree';
import _values from 'lodash/values';

import BaseModel from './BaseModel';

import roles from '../constants/roles';

const User = types.compose(
  'User',
  BaseModel,
  types.model({
    address: types.maybe(types.string),
    avatar: types.maybe(types.string),
    email: types.maybe(types.string),
    full_name: types.maybe(types.string),
    job_title: types.maybe(types.string),
    phone: types.maybe(types.string),
    role: types.maybe(types.enumeration(_values(roles))),
  }),
);

export default User;
