import { cast, flow, types } from 'mobx-state-tree';
import type { SnapshotIn } from 'mobx-state-tree';
import { AreaModel } from './area-model';
import { getAreaById, type RawAreaDto } from '../../../shared/api/areas-api';

type AreaSnapshot = SnapshotIn<typeof AreaModel>;

const normalizeArea = (rawArea: RawAreaDto): AreaSnapshot => {
  return {
    id: rawArea.id,
    street: rawArea.house?.address ?? null,
    house: null,
    flat: rawArea.str_number_full ?? rawArea.str_number ?? null,
  };
};

export const AreasStore = types
  .model('AreasStore', {
    itemsById: types.map(AreaModel),
    isLoading: types.optional(types.boolean, false),
    error: types.optional(types.maybeNull(types.string), null),
  })
  .actions((self) => ({
    setLoading(value: boolean) {
      self.isLoading = value;
    },
    setError(value: string | null) {
      self.error = value;
    },
    saveArea(area: AreaSnapshot) {
      self.itemsById.set(area.id, cast(area));
    },
  }))
  .actions((self) => {
    const fetchAreasByIds = flow(function* (ids: string[]) {
      const unknownIds = ids.filter((id) => !self.itemsById.has(id));

      if (unknownIds.length === 0) {
        return;
      }

      self.setLoading(true);
      self.setError(null);

      try {
        const responses: Awaited<ReturnType<typeof getAreaById>>[] = yield Promise.all(
          unknownIds.map((id) => getAreaById(id))
        );

        responses.forEach((response) => {
          const rawArea = response.results[0];

          if (!rawArea) {
            return;
          }

          self.saveArea(normalizeArea(rawArea));
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : 'Не удалось загрузить адреса';

        self.setError(message);
      } finally {
        self.setLoading(false);
      }
    });

    return {
      fetchAreasByIds,
    };
  });