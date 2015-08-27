import expect from 'expect';
import { createStore } from 'redux';
import Connector from '../../src/components/connector';
import _ from 'lodash';

describe('Connector', () => {
  let store;
  let connect;
  let scopeStub;

  beforeEach(() => {
    store = createStore((state, action) => ({
      foo: 'bar',
      baz: action.payload
    }));
    scopeStub = {
      $on: () => {},
      $destroy: () => {}
    };
    connect = Connector(store);
  });

	it('Should throw when not passed a $scope object', () => {
	  expect(connect.bind(connect, () => { }, () => ({}))).toThrow();
	  expect(connect.bind(connect, 15, () => ({}))).toThrow();
	  expect(connect.bind(connect, undefined, () => ({}))).toThrow();
	  expect(connect.bind(connect, {}, () => ({}))).toThrow();

	  expect(connect.bind(connect, scopeStub, () => ({}))).toNotThrow();
	});

  it('Should throw when selector does not return a plain object as target', () => {
    expect(connect.bind(connect, scopeStub, state => state.foo)).toThrow();
  });

  it('Should extend scope with selected state once directly after creation', () => {
    connect(
      scopeStub,
      () => ({
        vm: { test: 1 }
      }));

    expect(scopeStub.vm).toEqual({ test: 1 });
  });

  it('Should update the scope passed to connect when the store updates', () => {
    connect(scopeStub, state => state);
    store.dispatch({ type: 'ACTION', payload: 0 });
    expect(scopeStub.baz).toBe(0);
    store.dispatch({ type: 'ACTION', payload: 1 });
    expect(scopeStub.baz).toBe(1);
  });

  it('Should prevent unnecessary updates when state does not change (shallowly)', () => {
    connect(scopeStub, state => state);
    store.dispatch({ type: 'ACTION', payload: 5 });

    expect(scopeStub.baz).toBe(5);

    scopeStub.baz = 0;

    //this should not replace our mutation, since the state didn't change 
    store.dispatch({ type: 'ACTION', payload: 5 });

    expect(scopeStub.baz).toBe(0);

  });

  it('Should extend scope with actionCreators', () => {
    connect(scopeStub, () => ({}), { ac1: () => { }, ac2: () => { } });
    expect(_.isFunction(scopeStub.ac1)).toBe(true);
    expect(_.isFunction(scopeStub.ac2)).toBe(true);
  });

  it('Should provide dispatch to mapDispatchToScope when receiving a Function', () => {
    let receivedDispatch;
    connect(scopeStub, () => ({}), dispatch => { receivedDispatch = dispatch });
    expect(receivedDispatch).toBe(store.dispatch);
  });

});