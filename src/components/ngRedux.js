import Connector from './connector';
import invariant from 'invariant';
import {createStore, applyMiddleware, compose} from 'redux';
import digestMiddleware from './digestMiddleware';

import isArray from 'lodash.isarray';
import isFunction from 'lodash.isfunction';

export default function ngReduxProvider() {
  let _reducer = undefined;
  let _middlewares = undefined;
  let _storeEnhancers = undefined;
  let _initialState = undefined;

  this.createStoreWith = (reducer, middlewares, storeEnhancers, initialState) => {
    invariant(
      isFunction(reducer),
      'The reducer parameter passed to createStoreWith must be a Function. Instead received %s.',
      typeof reducer
    );

    invariant(
      !storeEnhancers || isArray(storeEnhancers),
      'The storeEnhancers parameter passed to createStoreWith must be an Array. Instead received %s.',
      typeof storeEnhancers
    );

    _reducer = reducer;
    _storeEnhancers = storeEnhancers
    _middlewares = middlewares || [];
    _initialState = initialState || {};
  };

  this.$get = ($injector) => {
    let store, resolvedMiddleware = [];

    for(let middleware of _middlewares) {
      if(typeof middleware === 'string') {
        resolvedMiddleware.push($injector.get(middleware));
      } else {
        resolvedMiddleware.push(middleware);
      }
    }

    let finalCreateStore = _storeEnhancers ? compose(..._storeEnhancers)(createStore) : createStore;

    //digestMiddleware needs to be the last one.
    resolvedMiddleware.push(digestMiddleware($injector.get('$rootScope')));

    store = applyMiddleware(...resolvedMiddleware)(finalCreateStore)(_reducer, _initialState);

    return {
      ...store,
      connect: Connector(store)
    };
  };

  this.$get.$inject = ['$injector'];
}
