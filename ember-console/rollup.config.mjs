import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es',
    preserveModules: true,
    preserveModulesRoot: 'src',
    sourcemap: true,
  },
  external: [
    '@glimmer/component',
    '@glimmer/tracking',
    'chalk',
    'yoga-layout',
  ],
  plugins: [
    nodeResolve({
      extensions: ['.ts', '.js'],
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false, // Glint handles declarations
      declarationMap: false,
      outDir: 'dist',
    }),
  ],
};
