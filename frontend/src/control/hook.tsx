import { useContext } from 'react';

import StoreContext from './context';

function useStores() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useRootStore должен находиться внутри RootStoreProvider');
  }

  return context;
}

export default useStores;
