import isFunction from '../utils/isFunction';
import shallowEqual from '../utils/shallowEqual';
import invariant from 'invariant';

export default function Connector(store) {
  return {
    connect: (selectors, callback, disableCaching = false) => {
      if (!Array.isArray(selectors)) {
        selectors = [selectors];
      }

      invariant(
        isFunction(callback),
        'The callback parameter passed to connect must be a Function. Instead received %s.',
        typeof selector
      );

      //Initial update
      let params = selectors.map(selector => selector(store.getState()));
      callback(...params);

      let unsubscribe = store.subscribe(() => {
        let nextParams = selectors.map(selector => selector(store.getState()));
        if (disableCaching || !shallowEqual(params, nextParams)) {
          callback(...nextParams);
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