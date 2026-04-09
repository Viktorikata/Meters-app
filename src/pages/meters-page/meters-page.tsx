import { useStore } from '../../app/store/store-context';

const MetersPage = () => {
  const { metersStore, areasStore } = useStore();

  return (
    <main>
      <h1>Список счётчиков</h1>
      <p>Текущая страница: {metersStore.currentPage}</p>
      <p>Лимит: {metersStore.limit}</p>
      <p>Количество адресов в кэше: {areasStore.itemsById.size}</p>
    </main>
  );
};

export default MetersPage;