
export default function connectorFactory($ngRedux) {
  let connector;
  return {
      connect: (select, target) => {
        connector = new Connector($ngRedux, select, target);
      },
      disconnect: () => connector.unsubscribe()
    }
}

class Connector {
  /* target can either be a function (callback) which will be called on each store's update with the selected state as param,
      or a property, in which case the new state will simply be copied over onto it*/
  constructor($ngRedux, select, target){
    this.select = select;
    this.target = target;
    this.reduxStore = $ngRedux.getStore();
    this._sliceState = {...this.select(this.reduxStore.getState())};
    this.unsubscribe = this.reduxStore.subscribe(this.onStoreChanged.bind(this));
  }

  onStoreChanged() {
    let nextState = this.select(this.reduxStore.getState());
    if (!this.isSliceEqual(this._sliceState, nextState)) {
      this.updateTarget(this.target, nextState)
      this._sliceState = {...nextState};
    }
  }

  updateTarget(target, state){
    this.isFunction(target) ? target(state) : angular.copy(state, target); 
  }

  function isFunction(object) {
    return object && getClass.call(object) == '[object Function]';
  }

  isSliceEqual(slice, nextSlice) {
    const isRefEqual = slice === nextSlice;
    if (isRefEqual || typeof slice !== 'object' || typeof nextSlice !== 'object') {
      return isRefEqual;
    }
    return this.shallowEqual(slice, nextSlice);
  }

  shallowEqual(objA, objB) {
    if (objA === objB) {
      return true;
    }

    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);

    if (keysA.length !== keysB.length) {
      return false;
    }

    // Test for A's keys different from B.
    var hasOwn = Object.prototype.hasOwnProperty;
    for (let i = 0; i < keysA.length; i++) {
      if (!hasOwn.call(objB, keysA[i]) ||
        objA[keysA[i]] !== objB[keysA[i]]) {
        return false;
      }
    }

    return true;
  }
}