const js = require('@eslint/js');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const reactRefreshPlugin = require('eslint-plugin-react-refresh');

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: '18.2' } },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
    rules: {
      // Base recommended from react
      ...(reactPlugin.configs?.flat?.recommended?.rules || {}),
      // JSX runtime config (React 17+)
      ...(reactPlugin.configs?.flat?.['jsx-runtime']?.rules || {}),
      // React hooks recommended rules
      ...(reactHooksPlugin.configs?.recommended?.rules || {}),
      // Vite React Fast Refresh rule
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    ignores: ['dist', '.eslintrc.cjs'],
  },
];