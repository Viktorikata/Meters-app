import { apiClient } from './client';

export type MeterDto = {
  id: string;
  _type: string[];
  area: {
    id: string;
  };
  is_automatic: boolean | null;
  description: string | null;
  installation_date: string;
  initial_values: number[];
};

export type MetersResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: MeterDto[];
};

type GetMetersParams = {
  limit: number;
  offset: number;
};

export const getMeters = ({ limit, offset }: GetMetersParams) => {
  return apiClient<MetersResponse>(`/meters/?limit=${limit}&offset=${offset}`);
};

export const deleteMeter = (meterId: string) => {
  return apiClient<void>(`/meters/${meterId}/`, {
    method: 'DELETE',
  });
};