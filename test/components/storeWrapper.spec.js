import expect from 'expect';
import { createStore } from 'redux';
import wrapStore from '../../src/components/storeWrapper';

const mockStore = function(callback) {
  return {
    dispatch: (action) => {
      callback(action);
    },
  };
};


describe('storeWrapper', () => {
  it('should pass new state from provided store to ngReduxStore', () => {
    let dispatches = 0;
    const providedStore = createStore((state, action) => action.payload);
    const ngReduxStore = mockStore((action) => {
      dispatches++;
      expect(action.type).toEqual('@@NGREDUX_PASSTHROUGH');

      if (action.payload) {
        expect(action.payload).toEqual('TEST DISPATCH');
      }
    });

    const wrappedStore = wrapStore(providedStore, ngReduxStore);

    providedStore.dispatch({
      type: 'TEST',
      payload: 'TEST DISPATCH'
    });

    expect(dispatches).toEqual(2);
  });
});
