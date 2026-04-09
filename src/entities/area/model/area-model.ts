import { types } from 'mobx-state-tree';

export const AreaModel = types.model('AreaModel', {
  id: types.identifierNumber,
  street: types.maybeNull(types.string),
  house: types.maybeNull(types.string),
  flat: types.maybeNull(types.string),
});