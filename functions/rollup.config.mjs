import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import external from 'rollup-plugin-peer-deps-external';

export default {
  input: ['src/index.ts'],
  plugins: [
    typescript(),
    nodeResolve(),
    external({
      includeDependencies: true,
    }),
  ],
  output: {
    file: 'lib/index.js',
    format: 'cjs',
    sourcemap: true,
  },
};
