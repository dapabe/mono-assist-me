import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/**/*.ts', 'src/**/*.tsx'],
  format: ['esm', 'cjs'],
  outDir: 'build',
  sourcemap: true,
  dts: true,
  clean: true,
  splitting: true,
  treeshake: true,
  external: ['react-native-udp'],
  ignoreWatch: ['node_modules/**/*', 'build/**/*'],
  watch: true,
});
