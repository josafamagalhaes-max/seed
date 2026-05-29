import tseslint from 'typescript-eslint';
import globals from 'globals';

const ignores = {
  ignores: [
    '**/dist/**',
    '**/node_modules/**',
    '**/coverage/**',
    '**/.next/**',
    '**/.turbo/**',
    '**/drizzle/**',
    '**/*.config.{js,mjs,cjs,ts,mts}',
  ],
};

const rules = {
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-require-imports': 'off',
  },
};

/** Base flat config for TypeScript/Node projects */
export const base = tseslint.config(
  ignores,
  tseslint.configs.recommended,
  { languageOptions: { globals: globals.node } },
  rules,
);

/** Extended config for browser / Next.js projects */
export const browser = tseslint.config(
  ignores,
  tseslint.configs.recommended,
  { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
  rules,
);
