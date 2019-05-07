import shallowEqual from '../utils/shallowEqual';
import wrapActionCreators from '../utils/wrapActionCreators';
import invariant from 'invariant';

import isPlainObject from 'lodash/isPlainObject';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';

const assign = Object.assign;
const defaultMapStateToTarget = () => ({});
const defaultMapDispatchToTarget = dispatch => ({dispatch});

export default function Connector(store) {
  return (mapStateToTarget, mapDispatchToTarget) => {

    let finalMapStateToTarget = mapStateToTarget || defaultMapStateToTarget;

    const finalMapDispatchToTarget = isObject(mapDispatchToTarget) && !isFunction(mapDispatchToTarget) ?
      wrapActionCreators(mapDispatchToTarget) :
      mapDispatchToTarget || defaultMapDispatchToTarget;

    invariant(
      isFunction(finalMapStateToTarget),
      'mapStateToTarget must be a Function. Instead received %s.', finalMapStateToTarget
      );

    invariant(
      isObject(finalMapDispatchToTarget) || isFunction(finalMapDispatchToTarget),
      'mapDispatchToTarget must be a plain Object or a Function. Instead received %s.', finalMapDispatchToTarget
      );

    let slice = getStateSlice(store.getState(), finalMapStateToTarget, false);
    const isFactory = isFunction(slice);

    if (isFactory) {
      finalMapStateToTarget = slice;
      slice = getStateSlice(store.getState(), finalMapStateToTarget);
    }

    const boundActionCreators = finalMapDispatchToTarget(store.dispatch);

    return (target) => {

      invariant(
        isFunction(target) || isObject(target),
        'The target parameter passed to connect must be a Function or a object.'
        );

      //Initial update
      updateTarget(target, slice, boundActionCreators);

      const unsubscribe = store.subscribe(() => {
        const nextSlice = getStateSlice(store.getState(), finalMapStateToTarget);
        if (!shallowEqual(slice, nextSlice)) {
          updateTarget(target, nextSlice, boundActionCreators, slice);
          slice = nextSlice;
        }
      });
      return unsubscribe;
    }

  }
}

function updateTarget(target, StateSlice, dispatch, prevStateSlice) {
  if(isFunction(target)) {
    target(StateSlice, dispatch, prevStateSlice);
  } else {
    assign(target, StateSlice, dispatch);
  }
}

function getStateSlice(state, mapStateToScope, shouldReturnObject = true) {
  const slice = mapStateToScope(state);

  if (shouldReturnObject) {
    invariant(
      isPlainObject(slice),
      '`mapStateToScope` must return an object. Instead received %s.',
      slice
      );
  } else {
    invariant(
      isPlainObject(slice) || isFunction(slice),
      '`mapStateToScope` must return an object or a function. Instead received %s.',
      slice
      );
  }

  return slice;
}
