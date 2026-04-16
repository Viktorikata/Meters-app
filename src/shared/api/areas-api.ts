import { apiClient } from './client';

export type RawAreaDto = {
  id: string;
  number: number | null;
  str_number: string | null;
  str_number_full: string | null;
  house: {
    address: string | null;
    id: string;
    fias_addrobjs: string[];
  } | null;
};

type AreaListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawAreaDto[];
};

export const getAreaById = (id: string) => {
  return apiClient<AreaListResponse>(`/areas/?id=${id}`);
};