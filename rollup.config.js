import path from 'path';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import postcss from 'rollup-plugin-postcss';
import postcssUrl from 'postcss-url';
import postcssImport from 'postcss-import';
import typescript from 'rollup-plugin-typescript2';
// import pkg from './package.json';

const PACKAGE_ROOT_PATH = process.cwd();
const INPUT_FILE = path.join(PACKAGE_ROOT_PATH, './lib/index.js');
const ASSETS_DIR = path.join(PACKAGE_ROOT_PATH, './dist/assets');
const pkg = require(path.join(PACKAGE_ROOT_PATH, './package.json'));

function makeExternalPredicate(externalArr) {
  if (!externalArr.length) {
    return () => false;
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`);
  return (id) => pattern.test(id);
}

function getExternal() {
  const external = Object.keys(pkg.peerDependencies || {});
  const allExternal = [...external, ...Object.keys(pkg.dependencies || {})];
  return makeExternalPredicate(allExternal);
}

export default {
  input: INPUT_FILE,
  external: getExternal(),
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    url({
      emitFiles: true,
      fileName: '[name][extname]',
      // destDir: './dist/assets',
      destDir: ASSETS_DIR,
      limit: 1,
    }),
    svgr(),
    postcss({
      modules: true,
      autoModules: false,
      // minimize: true,

      // extract: true,
      plugins: [postcssUrl(), postcssImport()],
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          declarationDir: path.join(PACKAGE_ROOT_PATH, './dist/index'),
          declarationMap: true,
        },
        // include: ['/lib'],
        include: [path.resolve(PACKAGE_ROOT_PATH, './lib')],
        exclude: ['node_modules', 'build', 'dist', 'example', 'rollup.config.js', 'src/__tests__', 'src/setup*.js'],
      },
      rollupCommonJSResolveHack: false,
      clean: true,
    }),
    resolve(),
    commonjs(),
    terser(),
  ],
};
