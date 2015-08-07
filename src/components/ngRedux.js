import isFunction from '../utils/isFunction';
import hashCode from '../utils/hashCode';
import invariant from 'invariant';
import shallowEqual from '../utils/shallowEqual';
import isPlainObject from '../utils/isPlainObject';

export default function ngReduxProvider() {
  let reduxStore = undefined;
  this.setReduxStore = store => reduxStore = store;

  this.$get = () => {
    return {
      connect: (selectors, callback) => {
        if (!Array.isArray(selectors)) {
          selectors = [selectors];
        }

        invariant(
          isFunction(callback),
          'The callback parameter passed to connect must be a Function. Instead received %s.',
          typeof selector
          );

        let params = null;
        let unsubscribe = reduxStore.subscribe(() => {
          let nextParams = selectors.map(selector => selector(reduxStore.getState()));
          if(params === null || params.every((param, index) => param !== nextParams[index])) {
           callback(params);
           params = nextParams;
         }
       });

        return unsubscribe;
      },
      getStore() {
        return reduxStore;
      }
    }
  }
}

