import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      // Allow unescaped entities in JSX (common in copywriting-heavy landing pages)
      'react/no-unescaped-entities': 'off',
      // Allow <img> when using Emotion-based components that wrap it
      '@next/next/no-img-element': 'warn',
      // react-hooks v5 strict rules — too aggressive for common Next.js patterns
      // (e.g. reading localStorage in useEffect to avoid SSR hydration mismatch)
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    // Relax purity rule in shadcn-generated UI components (not our code)
    files: ['src/components/ui/**'],
    rules: {
      'react-hooks/purity': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    'pnpm-lock.yaml',
  ]),
])

export default eslintConfig
