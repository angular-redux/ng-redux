import shallowEqual from '../utils/shallowEqual';
import invariant from 'invariant';
import _ from 'lodash';

export default function Connector(store, $injector) {
  return (selector, scope) => {

    invariant(scope && _.isFunction(scope.$on) &&  _.isFunction(scope.$destroy), 'The scope parameter passed to connect must be an instance of $scope.');

    //Initial update
    let slice = getStateSlice(store.getState(), selector);
    _.assign(scope, slice);

    let unsubscribe = store.subscribe(() => {
      let nextSlice = getStateSlice(store.getState(), selector);
      if (!shallowEqual(slice, nextSlice)) {
        slice = nextSlice;
        _.assign(scope, slice);
      }
    });

    scope.$on('$destroy', () => {
      unsubscribe();
    });
  }
}

function getStateSlice(state, selector) {
  let slice = selector(state);
  invariant(
    _.isPlainObject(slice),
    '`selector` must return an object. Instead received %s.',
    slice
  );
  return slice;
}
