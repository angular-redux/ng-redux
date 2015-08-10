import isFunction from '../utils/isFunction';
import invariant from 'invariant';

export default function Connector(store){
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

        //Initial update
        let params = selectors.map(selector => selector(store.getState()));
        callback(...params);

        let unsubscribe = store.subscribe(() => {
          let nextParams = selectors.map(selector => selector(store.getState()));
          if(params === null || params.some((param, index) => param !== nextParams[index])) {
           callback(...nextParams);
           params = nextParams.slice(0);
         }
       });

        return unsubscribe;
      },
      getStore() {
        return store;
      }
    }
}