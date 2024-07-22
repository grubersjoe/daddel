// @ts-check
import { fixupPluginRules } from '@eslint/compat';
import eslint from '@eslint/js';
// @ts-expect-error
import reactHooks from 'eslint-plugin-react-hooks';
// @ts-expect-error
import react from 'eslint-plugin-react/configs/recommended.js';
import globals from 'globals';
import typescript from 'typescript-eslint';

export default typescript.config(
  eslint.configs.recommended,
  ...typescript.configs.strictTypeChecked,
  {
    ignores: ['build/', 'public/'],
  },
  {
    rules: {
      '@typescript-eslint/array-type': [
        2,
        {
          default: 'generic',
        },
      ],
      '@typescript-eslint/no-confusing-void-expression': 0,
      '@typescript-eslint/restrict-template-expressions': 0,
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 0,
    },
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ...react,
    languageOptions: {
      ...react.languageOptions,
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    plugins: {
      'react-hooks': fixupPluginRules(reactHooks),
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
);
