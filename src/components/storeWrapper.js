export default function wrapStore(providedStore, ngReduxStore) {
  providedStore.subscribe(() => {
    let newState = providedStore.getState();
    ngReduxStore.dispatch({
      type: '@@NGREDUX_PASSTHROUGH',
      payload: newState
    });
  });
  providedStore.dispatch({ type: '@@NGREDUX_PASSTHROUGH_INIT' })
}
