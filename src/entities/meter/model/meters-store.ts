import { types } from 'mobx-state-tree';
import { MeterModel } from './meter-model';

export const MetersStore = types
  .model('MetersStore', {
    items: types.array(MeterModel),
    limit: types.optional(types.number, 20),
    offset: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    totalCount: types.optional(types.number, 0),
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
    setCurrentPage(page: number) {
      self.currentPage = page;
      self.offset = (page - 1) * self.limit;
    },
  }));