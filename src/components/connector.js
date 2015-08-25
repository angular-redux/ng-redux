import isFunction from '../utils/isFunction';
import isPlainObject from '../utils/isPlainObject';
import shallowEqual from '../utils/shallowEqual';
import invariant from 'invariant';

export default function Connector(store) {
  return (selector, target) => {

    //Initial update
    let params = getStateSlice(store.getState(), selector);
    target = angular.merge(target, params);

    let unsubscribe = store.subscribe(() => {
      let nextParams = getStateSlice(store.getState(), selector);
      if (!shallowEqual(params, nextParams)) {
        target = angular.merge(target, nextParams);
        params = nextParams;
      }
    });

    if(isFunction(target.$destroy)) {
      target.$on('$destroy', () => {
        unsubscribe();
      });
    }

    return unsubscribe;
  }
}

function getStateSlice(state, selector) {
  let slice = selector(state);
  invariant(
    isPlainObject(slice),
    '`selector` must return an object. Instead received %s.',
    slice
  );
  return slice;
}
