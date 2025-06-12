import { ConfigArray, reactConfig, tseslint } from '@janis.me/linter-config';

const config: ConfigArray = tseslint.config(...reactConfig, {
  rules: {
    '@typescript-eslint/consistent-type-definitions': 'off', // Events for emitters often must be types, not interfaces. So we disable this rule just for examples
  },
});

export default config;
