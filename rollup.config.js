import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import { dependencies, devDependencies } from './package.json'

const env = process.env.NODE_ENV;
const config = {
  entry: 'src/index.js',
  plugins: [],
};

const externals = [
  ...Object.keys(dependencies),
  ...Object.keys(devDependencies),
].join('|');

if (env === 'es' || env === 'cjs') {
  config.format = env;
  config.sourceMap = true;
  config.external = id => RegExp(`^(${externals})(\/.*)?$`).test(id);
  config.plugins.push(
    babel({
      runtimeHelpers: true,
    })
  )
}

if (env === 'development' || env === 'production') {
  config.format = 'umd';
  config.moduleName = 'NgRedux';
  config.sourceMap = true;
  config.external = ['redux'];
  config.globals = {
    redux: 'Redux',
  };
  config.plugins.push(
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    nodeResolve({
      jsnext: true,
    }),
    commonjs(),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
    })
  )
}

if (env === 'production') {
  config.plugins.push(
    uglify()
  )
}

export default config;
