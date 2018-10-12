import Connector from './connector';
import invariant from 'invariant';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import digestMiddleware from './digestMiddleware';
import providedStoreMiddleware from './providedStoreMiddleware';
import wrapStore from './storeWrapper';

import curry from 'lodash/curry';
import isFunction from 'lodash/isFunction';
import map from 'lodash/map';

const isArray = Array.isArray;

const typeIs = curry((type, val) => typeof val === type);
const isObject = typeIs('object');
const isString = typeIs('string');
const assign  = Object.assign;

export default function ngReduxProvider() {
  let _reducer = undefined;
  let _middlewares = undefined;
  let _storeEnhancers = undefined;
  let _initialState = undefined;
  let _reducerIsObject = undefined;
  let _providedStore = undefined;

  this.provideStore = (store, middlewares = [], storeEnhancers) => {
    _providedStore = store;
    _reducer = (state, action) => action.payload;
    _storeEnhancers = storeEnhancers;
    _middlewares = [...middlewares, providedStoreMiddleware(store)];
  }

  this.createStoreWith = (reducer, middlewares, storeEnhancers, initialState) => {
    invariant(
      isFunction(reducer) || isObject(reducer),
      'The reducer parameter passed to createStoreWith must be a Function or an Object. Instead received %s.',
      typeof reducer
    );

    invariant(
      !storeEnhancers || isArray(storeEnhancers),
      'The storeEnhancers parameter passed to createStoreWith must be an Array. Instead received %s.',
      typeof storeEnhancers
    );

    _reducer = reducer;
    _reducerIsObject = isObject(reducer);
    _storeEnhancers = storeEnhancers || [];
    _middlewares = middlewares || [];
    _initialState = initialState || {};
  };

  this.config = {
    debounce: {
      wait: undefined,
      maxWait: undefined,
    },
  };

  this.$get = ($injector) => {
    const resolveMiddleware = middleware => isString(middleware)
      ? $injector.get(middleware)
      : middleware;

    const resolvedMiddleware = map(_middlewares, resolveMiddleware);

    const resolveStoreEnhancer = storeEnhancer => isString(storeEnhancer)
      ? $injector.get(storeEnhancer)
      : storeEnhancer;

    const resolvedStoreEnhancer = map(_storeEnhancers, resolveStoreEnhancer);

    if (_reducerIsObject) {
      const getReducerKey = key => isString(_reducer[key])
        ? $injector.get(_reducer[key])
        : _reducer[key];

      const resolveReducerKey = (result, key) => assign({}, result,
        { [key]: getReducerKey(key) }
      );

      const reducersObj = Object
        .keys(_reducer)
        .reduce(resolveReducerKey, {});

      _reducer = combineReducers(reducersObj);
    }

    // digestMiddleware needs to be the last one.
    resolvedMiddleware.push(digestMiddleware($injector.get('$rootScope'), this.config.debounce));

    // combine middleware into a store enhancer.
    const middlewares = applyMiddleware(...resolvedMiddleware);

    // compose enhancers with middleware and create store.
    const store = createStore(_reducer, _initialState, compose(middlewares, ...resolvedStoreEnhancer));

    const mergedStore = assign({}, store, { connect: Connector(store) });

    if (_providedStore) wrapStore(_providedStore, mergedStore);

    return mergedStore;
  };

  this.$get.$inject = ['$injector'];
}
