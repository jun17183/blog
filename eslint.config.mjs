import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // 싱글 쿼터 사용 강제
      quotes: ['error', 'single', { avoidEscape: true }],
      // JSX에서도 싱글 쿼터 사용
      'jsx-quotes': ['error', 'prefer-single'],
      // Prettier 규칙 적용
      'prettier/prettier': 'error',
    },
  },
  prettierConfig,
]);

export default eslintConfig;
