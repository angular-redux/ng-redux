import isFunction from '../utils/isFunction';
import isPlainObject from '../utils/isPlainObject';
import shallowEqual from '../utils/shallowEqual';
import invariant from 'invariant';
import _ from 'lodash'

export default function Connector(store, $injector) {
  return (selector, target) => {

    invariant(
      isPlainObject(target),
      'The target parameter passed to connect must be a plain object. Instead received %s.',
      typeof target
    );

    //Initial update
    let slice = getStateSlice(store.getState(), selector);
    target = _.assign(target, slice);

    let unsubscribe = store.subscribe(() => {
      let nextSlice = getStateSlice(store.getState(), selector);
      if (!shallowEqual(slice, nextSlice)) {
        target = _.assign(target, nextSlice);
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
