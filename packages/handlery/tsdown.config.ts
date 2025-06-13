import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['./src'],
  dts: true,
  minify: true,
  format: 'esm',
  platform: 'neutral',
});
