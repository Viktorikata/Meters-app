import { types } from 'mobx-state-tree';
import { AreaModel } from './area-model';

export const AreasStore = types
  .model('AreasStore', {
    itemsById: types.map(AreaModel),
    isLoading: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
  })
  .actions((self) => ({
    setLoading(value: boolean) {
      self.isLoading = value;
    },
    setError(value: string | null) {
      self.error = value;
    },
  }));