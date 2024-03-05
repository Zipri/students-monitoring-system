import { createContext } from 'react';

import { RootStore } from './ioc';

const StoreContext = createContext<RootStore | undefined>(undefined);

export default StoreContext;
