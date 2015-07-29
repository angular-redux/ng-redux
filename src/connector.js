
export default function connectorFactory($ngRedux) {
  let connector;
  return {
      connect: (select, props) => {
        connector = new Connector($ngRedux, select, props);
      },
      disconnect: () => connector.unsubscribe()
    }
}

class Connector {
  constructor($ngRedux, select, props){
    this.select = select;
    this.props = props;
    this.reduxStore = $ngRedux.getStore();
    this._sliceState = {...this.select(this.reduxStore.getState())};
    this.unsubscribe = this.reduxStore.subscribe(this.onStoreChanged.bind(this));
  }

  onStoreChanged() {
    let nextState = this.select(this.reduxStore.getState());
    if (!this.isSliceEqual(this._sliceState, nextState)) {
      angular.copy(nextState, this.props);
      this._sliceState = {...nextState};
    }
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