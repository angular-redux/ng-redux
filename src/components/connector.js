import shallowEqual from '../utils/shallowEqual';
import wrapActionCreators from '../utils/wrapActionCreators';
import invariant from 'invariant';
import _ from 'lodash';

export default function Connector(store) {
  return (scope, mapStateToScope, mapDispatchToScope = {}, propertyKey) => {

    invariant(
      scope && _.isFunction(scope.$on) && _.isFunction(scope.$destroy),
      'The scope parameter passed to connect must be an instance of $scope.'
      );
    invariant(
      _.isFunction(mapStateToScope),
      'mapStateToScope must be a Function. Instead received $s.', mapStateToScope
      );
    invariant(
      _.isPlainObject(mapDispatchToScope) || _.isFunction(mapDispatchToScope),
      'mapDispatchToScope must be a plain Object or a Function. Instead received $s.', mapDispatchToScope
      );

    let slice = getStateSlice(store.getState(), mapStateToScope);
    let target = propertyKey ? scope[propertyKey] : scope;
     if(!target) {
      target = scope[propertyKey] = {};
     }

    const finalMapDispatchToScope = _.isPlainObject(mapDispatchToScope) ?
      wrapActionCreators(mapDispatchToScope) :
      mapDispatchToScope;

    //Initial update
    _.assign(target, slice, finalMapDispatchToScope(store.dispatch));

    subscribe(scope, store, () => {
      const nextSlice = getStateSlice(store.getState(), mapStateToScope);
      if (!shallowEqual(slice, nextSlice)) {
        slice = nextSlice;
        _.assign(target, slice);
      }
    });
  
  }
}

function subscribe(scope, store, callback) {
  const unsubscribe = store.subscribe(callback);

  scope.$on('$destroy', () => {
    unsubscribe();
  });
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