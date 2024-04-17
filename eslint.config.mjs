import js from '@eslint/js';
import typescript from 'typescript-eslint';

export default typescript.config(
  js.configs.recommended,
  ...typescript.configs.recommendedTypeChecked,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      reactHooks,
    },
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
);
