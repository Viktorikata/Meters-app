export const formatMeterType = (typesList: string[]) => {
  if (typesList.includes('ColdWaterAreaMeter')) {
    return 'ХВС';
  }

  if (typesList.includes('HotWaterAreaMeter')) {
    return 'ГВС';
  }

  return '—';
};