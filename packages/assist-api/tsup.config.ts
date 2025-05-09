import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/i18n/**/*.ts', 'src/i18n/i18n-react.tsx'],
  format: ['cjs', 'esm'],
  outDir: 'build',
  sourcemap: true,
  dts: true,
  clean: true,
  splitting: true,
  treeshake: true,
  external: ['react', 'react-native-udp'],
  ignoreWatch: ['node_modules/**/*', 'build/**/*'],
  watch: true,
});
