import { types } from 'mobx-state-tree';

export const MeterAreaModel = types.model('MeterAreaModel', {
  id: types.string,
});

export const MeterModel = types.model('MeterModel', {
  id: types.identifier,
  _type: types.array(types.string),
  area: MeterAreaModel,
  is_automatic: types.maybeNull(types.boolean),
  description: types.maybeNull(types.string),
  installation_date: types.string,
  initial_values: types.array(types.number),
});