import { apiClient } from './client';

export type AreaDto = {
  id: string;
  number: number;
  str_number: string;
  str_number_full: string;
  house: {
    id: string;
    address: string;
  };
};

export type AreasResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: AreaDto[];
};

export const getAreasByIds = (ids: string[]) => {
  const idsParam = ids.join(',');

  return apiClient<AreasResponse>(`/areas/?id__in=${idsParam}`);
};