import shallowEqual from '../utils/shallowEqual';
import wrapActionCreators from '../utils/wrapActionCreators';
import invariant from 'invariant';
import _ from 'lodash';

export default function Connector(store) {
  return (mapStateToTarget, mapDispatchToTarget = dispatch => ({dispatch})) => {
    invariant(
      _.isFunction(mapStateToTarget),
      'mapStateToTarget must be a Function. Instead received $s.', mapStateToTarget
      );

    invariant(
      _.isPlainObject(mapDispatchToTarget) || _.isFunction(mapDispatchToTarget),
      'mapDispatchToTarget must be a plain Object or a Function. Instead received $s.', mapDispatchToTarget
      );

    let slice = getStateSlice(store.getState(), mapStateToTarget);

    const finalMapDispatchToTarget = _.isPlainObject(mapDispatchToTarget) ?
      wrapActionCreators(mapDispatchToTarget) :
      mapDispatchToTarget;

      //find better name
    const actions = finalMapDispatchToTarget(store.dispatch);

    return (target) => {

      invariant(
        _.isFunction(target) || _.isObject(target),
        'The target parameter passed to connect must be a Function or a plain object.'
        );

       //Initial update
      updateTarget(target, slice, actions);

      const unsubscribe = store.subscribe(() => {
        const nextSlice = getStateSlice(store.getState(), mapStateToTarget);
        if (!shallowEqual(slice, nextSlice)) {
          slice = nextSlice;
          updateTarget(target, slice, actions);
        }
      });
      return unsubscribe;
    }

  }
}

function updateTarget(target, StateSlice, dispatch) {
  if(_.isFunction(target)) {
    target(StateSlice, dispatch);
  } else {
    _.assign(target, StateSlice, dispatch);
  }
}

function getStateSlice(state, mapStateToScope) {
  const slice = mapStateToScope(state);

  invariant(
    _.isPlainObject(slice),
    '`mapStateToScope` must return an object. Instead received %s.',
    slice
    );

  return slice;
}