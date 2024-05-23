import RootStoreProvider from 'control/provider.tsx';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RootStoreProvider>
    <App />
  </RootStoreProvider>
);
