import assign from 'lodash.assign';
import { combineReducers } from 'redux';

function _createReducer(fixedReducers, asyncReducers = {}) {
  return combineReducers(assign({}, fixedReducers, asyncReducers));
}

export function addReducer(store) {
  return (name, reducer) => {
    store.asyncReducers[name] = reducer;
    store.replaceReducer(_createReducer(store.fixedReducers, store.asyncReducers));
  };
}

export function removeReducer(store) {
  return (name) => {
    delete store.asyncReducers[name];
    store.replaceReducer(_createReducer(store.fixedReducers, store.asyncReducers));
  };
}
