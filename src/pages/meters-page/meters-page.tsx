import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../app/store/store-context';
import { formatDate } from '../../shared/lib/format-date';
import { formatAddress } from '../../shared/lib/format-address';
import './meters-page.css';

import meterColdIcon from '../../../image/cold.svg'
import meterHotIcon  from '../../../image/hot.svg'
import meterWarmIcon  from '../../../image/warm.svg'
import meterElectricIcon  from '../../../image/electric.svg'
import deleteIcon  from '../../../image/delete.svg'

const getPaginationItems = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>();

  pages.add(1);
  pages.add(2);
  pages.add(3);

  pages.add(totalPages - 2);
  pages.add(totalPages - 1);
  pages.add(totalPages);

  pages.add(currentPage - 1);
  pages.add(currentPage);
  pages.add(currentPage + 1);

  const sortedPages = Array.from(pages)
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const result: Array<number | string> = [];

  for (let index = 0; index < sortedPages.length; index += 1) {
    const current = sortedPages[index];
    const previous = sortedPages[index - 1];

    if (index > 0 && current - previous > 1) {
      result.push('...');
    }

    result.push(current);
  }

  return result;
};

const getMeterTypeMeta = (typesList: string[]) => {
  if (typesList.includes('ColdWaterAreaMeter')) {
    return {
      label: 'ХВС',
      icon: meterColdIcon,
      className: 'meter-type',
    };
  }

  if (typesList.includes('HotWaterAreaMeter')) {
    return {
      label: 'ГВС',
      icon: meterHotIcon,
      className: 'meter-type',
    };
  }

  if (typesList.includes('ElectricAreaMeter')) {
    return {
      label: 'ЭЛ/ДТ',
      icon: meterElectricIcon,
      className: 'meter-type',
    };
  }

  return {
    label: 'ТПЛ',
    icon: meterWarmIcon,
    className: 'meter-type',
  };
};

const MetersPage = observer(() => {
  const { metersStore, areasStore } = useStore();

  useEffect(() => {
    metersStore.fetchMeters();
  }, [metersStore]);

  const handlePageChange = (page: number) => {
    if (page === metersStore.currentPage) {
      return;
    }

    metersStore.setCurrentPage(page);
    metersStore.fetchMeters();
  };

  return (
    <main className="meters-page">
      <section className="meters-card">
        <h1 className="meters-card__title">Список счётчиков</h1>

        {metersStore.error && (
          <div className="meters-card__error">Ошибка: {metersStore.error}</div>
        )}

        <div className="meters-table-wrapper">
          <div className="meters-table-scroll">
            <table className="meters-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Тип</th>
                  <th>Дата установки</th>
                  <th>Автоматический</th>
                  <th>Текущие показания</th>
                  <th>Адрес</th>
                  <th>Примечание</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {metersStore.isLoading ? (
                  <tr>
                    <td colSpan={8} className="meters-table__status">
                      Загрузка...
                    </td>
                  </tr>
                ) : metersStore.items.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="meters-table__status">
                      Нет данных
                    </td>
                  </tr>
                ) : (
                  metersStore.items.map((meter, index) => {
                    const area = areasStore.itemsById.get(meter.area.id);

                    return (
                      <tr key={meter.id} className="meters-table__row">
                        <td>{metersStore.offset + index + 1}</td>
                        <td>
                          {(() => {
                            const meterType = getMeterTypeMeta(meter._type);

                            return (
                              <div className={meterType.className}>
                                <img
                                  className="meter-type__icon"
                                  src={meterType.icon}
                                  alt=""
                                  aria-hidden="true"
                                />
                                <span className="meter-type__label">{meterType.label}</span>
                              </div>
                            );
                          })()}
                        </td>
                                                <td>{formatDate(meter.installation_date)}</td>
                        <td>{meter.is_automatic ? 'да' : 'нет'}</td>
                        <td>
                          {meter.initial_values.length > 0
                            ? meter.initial_values.join(', ')
                            : '—'}
                        </td>
                        <td>{formatAddress(area)}</td>
                        <td>{meter.description || '—'}</td>
                        <td className="meters-table__delete-cell">
                          <button
                            className="meters-table__delete-button"
                            type="button"
                            onClick={() => metersStore.deleteMeterById(meter.id)}
                            disabled={
                              metersStore.isDeleting &&
                              metersStore.deletingId === meter.id
                            }
                            aria-label="Удалить счётчик"
                          >
                            {metersStore.isDeleting &&
                            metersStore.deletingId === meter.id
                              ? '...'
                              :(
                                <img
                                  src={deleteIcon}
                                  alt=""
                                  aria-hidden="true"
                                  className="meters-table__delete-icon"
                                
                                />
                              )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="pagination">
  {getPaginationItems(
    metersStore.currentPage,
    metersStore.totalPages
  ).map((item, index) => {
    if (item === '...') {
      return (
        <span key={`dots-${index}`} className="pagination__dots">
          ...
        </span>
      );
    }

const page = item as number;

return (
  <button
    key={page}
    type="button"
    className={`pagination__button ${
      page === metersStore.currentPage
        ? 'pagination__button--active'
        : ''
    }`}
    onClick={() => handlePageChange(page)}
  >
    {page}
  </button>
);
  })}
</div>

      </section>
    </main>
  );
});

export default MetersPage;