const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const postcss = require('rollup-plugin-postcss');
const babel = require('@rollup/plugin-babel');

module.exports = {
  input: 'src/index.js',
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      sourcemap: true,
      entryFileNames: 'index.js',
    },
    {
      dir: 'dist',
      format: 'esm',
      sourcemap: true,
      entryFileNames: 'index.esm.js',
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
      extensions: ['.js', '.jsx'],
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx'],
      presets: ['@babel/preset-react'],
    }),
    commonjs(),
    postcss({
      extract: true,
      minimize: true,
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    }),
  ],
  external: ['react', 'react-dom'],
};
