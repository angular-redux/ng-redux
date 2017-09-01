import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;
const config = {
  entry: 'src/index.js',
  plugins: [],
};

if (env === 'es' || env === 'cjs') {
  config.format = env;
  config.external = [
    'invariant',
    'lodash.curry',
    'lodash.isfunction',
    'lodash.isobject',
    'lodash.isplainobject',
    'lodash.map',
    'object-assign',
    'redux',
  ];
  config.plugins.push(
    babel()
  )
}

if (env === 'development' || env === 'production') {
  config.format = 'umd';
  config.moduleName = 'NgRedux';
  config.plugins.push(
    nodeResolve({
      jsnext: true,
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  )
}

if (env === 'production') {
  config.plugins.push(
    uglify()
  )
}

export default config;
