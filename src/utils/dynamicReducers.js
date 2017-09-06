import assign from 'lodash.assign';
import curry from 'lodash.curry';
import invariant from 'invariant';
import { combineReducers } from 'redux';

const typeIs = curry((type, val) => typeof val === type);
const isObject = typeIs('object');

function _createReducer(fixedReducers, asyncReducers = {}) {
  return combineReducers(assign({}, fixedReducers, asyncReducers));
}

export function addReducer(store) {
  return (name, reducer) => {
    invariant(
      isObject(store.fixedReducers),
      'To use async reducers, the reducer parameter passed to createStoreWith must be an Object. Instead received %s.',
      typeof store.fixedReducers
    );

    store.asyncReducers[name] = reducer;
    store.replaceReducer(_createReducer(store.fixedReducers, store.asyncReducers));
  };
}

export function removeReducer(store) {
  return (name) => {
    invariant(
      isObject(store.fixedReducers),
      'To use async reducers, the reducer parameter passed to createStoreWith must be an Object. Instead received %s.',
      typeof store.fixedReducers
    );

    delete store.asyncReducers[name];
    store.replaceReducer(_createReducer(store.fixedReducers, store.asyncReducers));
  };
}
