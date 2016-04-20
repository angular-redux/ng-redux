import Connector from './connector';
import invariant from 'invariant';
import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import digestMiddleware from './digestMiddleware';

import assign from 'lodash.assign';
import isArray from 'lodash.isarray';
import isFunction from 'lodash.isfunction';
import isObject from 'lodash.isobject';

export default function ngReduxProvider() {
  let _reducer = undefined;
  let _middlewares = undefined;
  let _storeEnhancers = undefined;
  let _initialState = undefined;
  let _reducerIsObject = undefined;
  let _combineReducers = undefined;

  this.combineReducersFunc = (func) => {
    invariant(
      isFunction(reducer),
      'The parameter passed to combineReducersFunc must be a Function. Instead received %s.',
      typeof reducer
    );

    _combineReducers = func;
  };

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
    _storeEnhancers = storeEnhancers
    _middlewares = middlewares || [];
    _initialState = initialState;
  };

  this.$get = ($injector) => {
    let store, resolvedMiddleware = [];
    let finalCombineReducers = _combineReducers ? _combineReducers : combineReducers;

    for(let middleware of _middlewares) {
      if(typeof middleware === 'string') {
        resolvedMiddleware.push($injector.get(middleware));
      } else {
        resolvedMiddleware.push(middleware);
      }
    }

    if(_reducerIsObject) {
      let reducersObj = {};
      let reducKeys = Object.keys(_reducer); 

      reducKeys.forEach((key) => {
        if(typeof _reducer[key] === 'string') { 
          reducersObj[key] = $injector.get(_reducer[key]);
        } else {
          reducersObj[key] = _reducer[key];
        }  
      });

      _reducer = finalCombineReducers(reducersObj);
    }

    let finalCreateStore = _storeEnhancers ? compose(..._storeEnhancers)(createStore) : createStore;

    //digestMiddleware needs to be the last one.
    resolvedMiddleware.push(digestMiddleware($injector.get('$rootScope')));

    store = _initialState 
      ? applyMiddleware(...resolvedMiddleware)(finalCreateStore)(_reducer, _initialState)
      : applyMiddleware(...resolvedMiddleware)(finalCreateStore)(_reducer);

    return assign({}, store, { connect: Connector(store) });
  };

  this.$get.$inject = ['$injector'];
}
