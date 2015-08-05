import shallowEqual from '../utils/shallowEqual';
import isFunction from '../utils/isFunction';
import isPlainObject from '../utils/isPlainObject';
import invariant from 'invariant';

export default function connectorFactory($ngRedux) { 
  return {
      connect: (select, target) => {
        let connector = new Connector($ngRedux, select, target);
        return connector.unsubscribe;
      }
    }
}

export class Connector {
  constructor($ngRedux, selector, callback){

    invariant(
      isFunction(selector),
      'The selector passed to connect must be a function. Instead received %s.',
      typeof selector
    );

    invariant(
      isFunction(callback),
      'The callback passed to connect must be a function. Instead received %s.',
      typeof callback
    );

    this.select = selector;
    this.callback = callback;
    this.reduxStore = $ngRedux.getStore();
    this._sliceState = this.selectState(this.reduxStore.getState(), this.select);
    //force a first update to initialize subscribing component
    this.updateTarget(this.callback, this._sliceState);
    this.unsubscribe = this.reduxStore.subscribe(this.onStoreChanged.bind(this));
  }

  onStoreChanged() {
    let nextState = this.selectState(this.reduxStore.getState(), this.select);
    if (!this.isSliceEqual(this._sliceState, nextState)) {
      this.updateTarget(this.callback, nextState)
      this._sliceState = {...nextState};
    }
  }

  updateTarget(target, state){  
    target(state) 
  }

  selectState(state, selector) {
    let slice = selector(state);
    
    return slice;
  }

  isSliceEqual(slice, nextSlice) {
    const isRefEqual = slice === nextSlice;
    if (isRefEqual || typeof slice !== 'object' || typeof nextSlice !== 'object') {
      return isRefEqual;
    }
    return shallowEqual(slice, nextSlice);
  }
}