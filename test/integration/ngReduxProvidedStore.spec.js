import expect from 'expect';
import ngReduxProvider from '../../src/components/ngRedux';
import { createStore, combineReducers } from 'redux';


describe('ngRedux provide store functionality', () => {
  let ngRedux = {};
  let $injector = {};
  let $rootScope = {
    $evalAsync: () => {}
  }

  beforeEach(() => {
    ngRedux = new ngReduxProvider();
    $injector = {
      get: () => {
        return $rootScope;
      },
    };
  });

  it('should dispatch both ways', () => {
    const providedStore = createStore((state, action) => action.payload || state, 'initial state');

    ngRedux.provideStore(providedStore);

    const ngredux = ngRedux['$get']($injector);

    expect(ngredux.getState()).toEqual('initial state');

    providedStore.dispatch({ type: 'TEST', payload: 'new state through provider' });

    expect(providedStore.getState()).toEqual('new state through provider');
    expect(ngredux.getState()).toEqual('new state through provider');

    ngredux.dispatch({
      type: 'TEST',
      payload: 'new state through ngredux'
    });

    expect(providedStore.getState()).toEqual('new state through ngredux');
    expect(ngredux.getState()).toEqual('new state through ngredux');
  });

  it('should work with combineReducers', () => {
    const initialFooState = 'foo state';
    const initialBarState = 'bar state';
    const combinedReducers = combineReducers({
      fooState: (state = initialFooState, action) => action.payload || state,
      barState: (state = initialBarState, action) => action.payload || state,
    })
    const providedStore = createStore(combinedReducers);

    ngRedux.provideStore(providedStore);

    const ngredux = ngRedux['$get']($injector);

    expect(ngredux.getState()).toEqual({
      fooState: 'foo state',
      barState: 'bar state'
    });

    providedStore.dispatch({ type: 'TEST', payload: 'new state through provider' });

    expect(providedStore.getState()).toEqual({
      fooState: 'new state through provider',
      barState: 'new state through provider'
    });
    expect(ngredux.getState()).toEqual({
      fooState: 'new state through provider',
      barState: 'new state through provider'
    });

    ngredux.dispatch({
      type: 'TEST',
      payload: 'new state through ngredux'
    });

    expect(providedStore.getState()).toEqual({
      fooState: 'new state through ngredux',
      barState: 'new state through ngredux'
    });
    expect(ngredux.getState()).toEqual({
      fooState: 'new state through ngredux',
      barState: 'new state through ngredux'
    });
  });

});
