import { types} from 'mobx-state-tree';
import type {Instance} from 'mobx-state-tree';
import { MetersStore } from '../../entities/meter/model/meters-store';
import { AreasStore } from '../../entities/area/model/areas-store';


export const RootStore = types.model('RootStore', {
    metersStore: types.optional(MetersStore, {}),
    areasStore: types.optional(AreasStore, {}),
});

export type RootStoreInstance = Instance<typeof RootStore>