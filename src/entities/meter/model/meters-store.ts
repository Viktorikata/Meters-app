import { cast, flow, getRoot, types } from 'mobx-state-tree';
import type { SnapshotIn } from 'mobx-state-tree';
import { MeterModel } from './meter-model';
import {
  deleteMeter,
  getMeters,
  type MeterDto,
} from '../../../shared/api/meters-api';

type MeterSnapshot = SnapshotIn<typeof MeterModel>;

type RootStoreLike = {
  areasStore: {
    fetchAreasByIds: (ids: string[]) => Promise<unknown>;
  };
};

export const MetersStore = types
  .model('MetersStore', {
    items: types.array(MeterModel),
    limit: types.optional(types.number, 20),
    offset: types.optional(types.number, 0),
    currentPage: types.optional(types.number, 1),
    totalCount: types.optional(types.number, 0),
    isLoading: types.optional(types.boolean, false),
    isDeleting: types.optional(types.boolean, false),
    deletingId: types.maybeNull(types.string),
    error: types.optional(types.maybeNull(types.string), null),
  })
  .views((self) => ({
    get totalPages() {
      return Math.max(1, Math.ceil(self.totalCount / self.limit));
    },
  }))
  .actions((self) => ({
    setLoading(value: boolean) {
      self.isLoading = value;
    },
    setDeleting(value: boolean) {
      self.isDeleting = value;
    },
    setDeletingId(value: string | null) {
      self.deletingId = value;
    },
    setError(value: string | null) {
      self.error = value;
    },
    setItems(items: MeterSnapshot[]) {
      self.items = cast(items);
    },
    setTotalCount(count: number) {
      self.totalCount = count;
    },
    setCurrentPage(page: number) {
      self.currentPage = page;
      self.offset = (page - 1) * self.limit;
    },
  }))
  .actions((self) => {
    const fetchMeters = flow(function* () {
      self.setLoading(true);
      self.setError(null);

      try {
        const response: Awaited<ReturnType<typeof getMeters>> = yield getMeters({
          limit: self.limit,
          offset: self.offset,
        });

        self.setItems(response.results);
        self.setTotalCount(response.count);

        const root = getRoot(self) as RootStoreLike;

        const uniqueAreaIds = Array.from(
          new Set(response.results.map((meter: MeterDto) => meter.area.id))
        );

        yield root.areasStore.fetchAreasByIds(uniqueAreaIds);
      } catch (error) {
        if (error instanceof Error) {
          self.setError(error.message);
        } else {
          self.setError('Не удалось загрузить счётчики');
        }
      } finally {
        self.setLoading(false);
      }
    });

    const deleteMeterById = flow(function* (meterId: string) {
      self.setDeleting(true);
      self.setDeletingId(meterId);
      self.setError(null);

      try {
        yield deleteMeter(meterId);

        if (self.totalCount > 0) {
          self.setTotalCount(self.totalCount - 1);
        }

        const maxPageAfterDelete = Math.max(
          1,
          Math.ceil(Math.max(0, self.totalCount) / self.limit)
        );

        if (self.currentPage > maxPageAfterDelete) {
          self.setCurrentPage(maxPageAfterDelete);
        }

        yield fetchMeters();
      } catch (error) {
        if (error instanceof Error) {
          self.setError(error.message);
        } else {
          self.setError('Не удалось удалить счётчик');
        }
      } finally {
        self.setDeleting(false);
        self.setDeletingId(null);
      }
    });

    return {
      fetchMeters,
      deleteMeterById,
    };
  });