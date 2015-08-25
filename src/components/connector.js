import isFunction from '../utils/isFunction';
import isPlainObject from '../utils/isPlainObject';
import shallowEqual from '../utils/shallowEqual';
import invariant from 'invariant';

export default function Connector(store) {
  return (selector, target) => {

    //Initial update
    let slice = getStateSlice(store.getState(), selector);
    target = angular.merge(target, slice);

    let unsubscribe = store.subscribe(() => {
      let nextSlice = getStateSlice(store.getState(), selector);
      if (!shallowEqual(slice, nextSlice)) {
        target = angular.merge(target, nextSlice);
        slice = nextSlice;
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
