// Configuration ESLint partagée (format plat) pour tous les paquets du monorepo.
// Chaque paquet lance « eslint . » : ESLint remonte jusqu'à ce fichier.
// apps/mobile pourra avoir son propre eslint.config.mjs qui importe celui-ci
// et y ajoute les règles React / Expo.
import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores([
    '**/node_modules/',
    '**/dist/',
    '**/build/',
    '**/coverage/',
    '**/.expo/',
    '.github/',
    '.claude/',
    'docs/',
  ]),
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        // Chaque fichier TypeScript est analysé avec le tsconfig.json le plus proche.
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      eqeqeq: ['error', 'always'],
      'no-console': 'warn',
    },
  },
  {
    // Fichiers JavaScript (configurations) : pas d'analyse typée, environnement Node.
    files: ['**/*.{js,mjs,cjs}'],
    extends: [tseslint.configs.disableTypeChecked],
    languageOptions: {
      globals: globals.node,
    },
  },
  // Toujours en dernier : désactive les règles de style gérées par Prettier.
  prettier,
);
