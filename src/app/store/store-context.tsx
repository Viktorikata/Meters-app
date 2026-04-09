import { createContext, useContext} from 'react';
import type {ReactNode} from 'react';
import { RootStore} from './root-store';
import type {RootStoreInstance} from './root-store';


const rootStore = RootStore.create({});

const StoreContext = createContext<RootStoreInstance | null>(null);

type StoreProviderProps = {
  children: ReactNode;
};

export const StoreProvider = ({ children }: StoreProviderProps) => {
  return (
    <StoreContext.Provider value={rootStore}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error('useStore must be used inside StoreProvider');
  }

  return store;
};