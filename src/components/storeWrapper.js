export default function wrapStore(providedStore, ngReduxStore) {
  const unsubscribe = providedStore
    .subscribe(() => {
      let newState = providedStore.getState();
      ngReduxStore.dispatch({
        type: '@@NGREDUX_PASSTHROUGH',
        payload: newState
      });
    })
  ;
}
