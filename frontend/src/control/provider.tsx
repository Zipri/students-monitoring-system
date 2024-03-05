import { ReactNode } from 'react';

import StoreContext from './context';
import { rootStoreInstance } from './ioc';

function RootStoreProvider({ children }: { children: ReactNode }) {
  const root = rootStoreInstance;

  return <StoreContext.Provider value={root}>{children}</StoreContext.Provider>;
}

export default RootStoreProvider;
