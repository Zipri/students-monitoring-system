module.exports = {
  // Указывает, что это корневой конфигурационный файл и ESLint не должен продолжать поиск в родительских директориях.
  root: true,
  env: {
    // Указывает, что код будет выполняться в браузере, включает глобальные переменные браузера.
    browser: true,
    // Указывает, что код написан с использованием возможностей ES2020.
    es2020: true,
  },
  extends: [
    // Включает набор правил ESLint.
    'eslint:recommended',
    // Включает правила из плагина @typescript-eslint.
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    // Включает правила для хуков React.
    'plugin:react-hooks/recommended',
    // Включает настройки Prettier для ESLint, чтобы избежать конфликтов в форматировании.
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest', // Использует последнюю версию ECMAScript
    sourceType: 'module', // Работает с модулями ES6
    project: ['./tsconfig.json', './tsconfig.node.json'], // Пути к файлам конфигурации TS для анализа
    tsconfigRootDir: __dirname, // Указывает корневую директорию для файлов конфигурации TS
  },
  // Подключает плагины, в данном случае для поддержки горячей перезагрузки React компонентов.
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      // Уровень предупреждения для правила.
      'warn',
      // Настройка правила, позволяющая экспортировать компоненты как константы.
      { allowConstantExport: true },
    ],
    // 'react/jsx-uses-react': 'off',
    // 'react/react-in-jsx-scope': 'off',
  },
};
