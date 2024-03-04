import TurboConsole from 'unplugin-turbo-console/vite';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3005,
  },
  plugins: [
    react(), //плагин для подержки разработки на React
    tsconfigPaths(), //плагин для поддержки работы алиасов TS (@components и пр, см. tsconfig.paths.json)
    svgr(), //плагин, позволяющий подтягивать статичные ассеты в проект
    TurboConsole(), //плагин для более информативной консоли
  ],
});
