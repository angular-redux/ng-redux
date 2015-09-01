import shallowEqual from '../utils/shallowEqual';
import wrapActionCreators from '../utils/wrapActionCreators';
import invariant from 'invariant';
import _ from 'lodash';

const defaultMapStateToTarget = () => ({});
const defaultMapDispatchToTarget = dispatch => ({dispatch});

export default function Connector(store) {
  return (mapStateToTarget, mapDispatchToTarget) => {

    const finalMapStateToTarget = mapStateToTarget || defaultMapStateToTarget;

    const finalMapDispatchToTarget = _.isPlainObject(mapDispatchToTarget) ?
      wrapActionCreators(mapDispatchToTarget) :
      mapDispatchToTarget || defaultMapDispatchToTarget;

    invariant(
      _.isFunction(finalMapStateToTarget),
      'mapStateToTarget must be a Function. Instead received $s.', finalMapStateToTarget
      );

    invariant(
      _.isPlainObject(finalMapDispatchToTarget) || _.isFunction(finalMapDispatchToTarget),
      'mapDispatchToTarget must be a plain Object or a Function. Instead received $s.', finalMapDispatchToTarget
      );

    let slice = getStateSlice(store.getState(), finalMapStateToTarget);

    const boundActionCreators = finalMapDispatchToTarget(store.dispatch);

    return (target) => {

      invariant(
        _.isFunction(target) || _.isObject(target),
        'The target parameter passed to connect must be a Function or a plain object.'
        );

      //Initial update
      updateTarget(target, slice, boundActionCreators);

      const unsubscribe = store.subscribe(() => {
        const nextSlice = getStateSlice(store.getState(), finalMapStateToTarget);
        if (!shallowEqual(slice, nextSlice)) {
          slice = nextSlice;
          updateTarget(target, slice, boundActionCreators);
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