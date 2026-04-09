import { types } from 'mobx-state-tree';

export const MeterModel = types.model('MeterModel', {
  id: types.identifierNumber,
  area_id: types.number,
  type: types.string,
  installation_date: types.string,
  is_automatic: types.boolean,
  initial_values: types.array(types.number),
  description: types.maybeNull(types.string),
});