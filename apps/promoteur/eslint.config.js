import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

/**
 * ESLint configuration for Promoteur app
 *
 * Includes strict boundary rules to prevent cross-app imports
 */
export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // ═══════════════════════════════════════════════════════════════════
      // BOUNDARY RULES: Prevent cross-app imports
      // ═══════════════════════════════════════════════════════════════════
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/apps/ppe-admin/**', '../../../ppe-admin/**', '../../ppe-admin/**'],
              message:
                '❌ Import interdit depuis app PPE-Admin. Les apps doivent rester indépendantes. Utilisez @realpro/entities/shared pour les types partagés.',
            },
            {
              group: ['**/apps/regie/**', '../../../regie/**', '../../regie/**'],
              message:
                '❌ Import interdit depuis app Régie. Les apps doivent rester indépendantes. Utilisez @realpro/entities/shared pour les types partagés.',
            },
          ],
        },
      ],
    },
  }
);
