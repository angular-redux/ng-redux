import isFunction from '../utils/isFunction';
import shallowEqual from '../utils/shallowEqual';
import invariant from 'invariant';

export default function Connector(store) {
  return {
    connect: (selector, callback, disableCaching = false) => {
      invariant(
        isFunction(callback),
        'The callback parameter passed to connect must be a Function. Instead received %s.',
        typeof callback
      );

      //Initial update
      let params = selector(store.getState());
      callback(params);

      let unsubscribe = store.subscribe(() => {
        let nextParams = selector(store.getState());
        if (disableCaching || !shallowEqual(params, nextParams)) {
          callback(nextParams);
          params = nextParams;
        }
      });

      return unsubscribe;
    },
    getStore() {
      return store;
    }
  }
}