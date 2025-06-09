import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: 'threads',
    workspace: [
      {
        test: {
          name: 'unit',
          include: ['./packages/**/test/*.unit.test.{ts,tsx}'],
          css: true,
        },
      },
    ],
    reporters: [['verbose', { summary: true }]],
    coverage: {
      provider: 'v8',
    },
  },
});
