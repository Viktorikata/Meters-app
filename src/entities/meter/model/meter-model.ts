import { types } from 'mobx-state-tree';

export const MeterAreaLinkModel = types.model('MeterAreaLinkModel', {
  id: types.string,
});

export const MeterModel = types.model('MeterModel', {
  id: types.identifier,
  _type: types.array(types.string),
  area: MeterAreaLinkModel,
  is_automatic: types.maybeNull(types.boolean),
  description: types.maybeNull(types.string),
  installation_date: types.string,
  initial_values: types.array(types.number),
});