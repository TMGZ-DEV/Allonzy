// Configuration ESLint de l'application mobile : règles Expo / React,
// puis la configuration partagée du monorepo, qui garde le dernier mot
// (TypeScript strict typé, puis eslint-config-prettier en dernier).
import expoConfig from 'eslint-config-expo/flat.js';
import { defineConfig, globalIgnores } from 'eslint/config';

import racine from '../../eslint.config.mjs';

export default defineConfig(globalIgnores(['android/', 'ios/']), expoConfig, racine);
