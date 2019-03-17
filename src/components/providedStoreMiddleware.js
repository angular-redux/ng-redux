/**
 * middleware for the empty store that ng-redux uses when a external store is provided
 * Provides two cases:
 * 1. NGREDUX_PASSTHROUGH, where data is coming IN to the "fake" store
 * 2. all other, where actions are dispatched out, and proxied to the true store
 */
export default _providedStore => store => next => action => {
  return action.type === '@@NGREDUX_PASSTHROUGH'
    ? next(action)
    : _providedStore.dispatch(action)
}
