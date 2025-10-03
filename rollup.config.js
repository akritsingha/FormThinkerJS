const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const postcss = require('rollup-plugin-postcss');
const babel = require('@rollup/plugin-babel');

module.exports = {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      inlineDynamicImports: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      inlineDynamicImports: true,
    },
  ],
  plugins: [
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
      extract: false,
      inject: true,
      minimize: true,
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    }),
  ],
  external: ['react', 'react-dom'],
};
