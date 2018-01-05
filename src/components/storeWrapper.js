export default function wrapStore(providedStore, ngReduxStore) {
  const unsubscribe = providedStore
    .subscribe(() => {
      let newState = providedStore.getState();

      ngReduxStore.dispatch(newState);
    })
  ;

  return Object.assign({},
    providedStore,
    {
      subscribe: ngReduxStore.subscribe
    })
  ;
}
