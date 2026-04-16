type AreaLike = {
  street: string | null;
  house: string | null;
  flat: string | null;
};

export const formatAddress = (area?: AreaLike) => {
  if (!area) {
    return 'Загрузка адреса...';
  }

  const parts = [area.street, area.house, area.flat]
    .filter(Boolean)
    .join(', ');

  return parts || 'Адрес не найден';
};