import expect from 'expect';
import {createStore} from 'redux';
import Connector from '../../src/components/connector';

describe('Connector', () => {
	let store;
	let connect;

	beforeEach(() => {
		store = createStore((state, action) => ({
      foo: 'bar',
      baz: action.payload,
      anotherState: 12
		}));
		connect = Connector(store);
	});

	it('Should throw when not passed a function as callback', () => {
		expect(connect.bind(connect, () => {}, undefined)).toThrow();
		expect(connect.bind(connect, () => {}, {})).toThrow();
		expect(connect.bind(connect, () => {}, 15)).toThrow();
	});

	it('Callback should be called once directly after creation to allow initialization', () => {
		let counter = 0;
		let callback = () => counter++;
		connect(state => state, callback);
		expect(counter).toBe(1);
	});

	it('Should call the callback passed to connect when the store updates', () => {
		let counter = 0;
		let callback = () => counter++;
		connect(state => state, callback);
		store.dispatch({type: 'ACTION', payload: 0});
		store.dispatch({type: 'ACTION', payload: 1});
		expect(counter).toBe(3);
	});

	 it('Should prevent unnecessary updates when state does not change (shallowly)', () => {
		let counter = 0;
		let callback = () => counter++;
		connect(state => ({baz: state.baz}), callback);
		store.dispatch({type: 'ACTION', payload: 0});
		store.dispatch({type: 'ACTION', payload: 0});
		store.dispatch({type: 'ACTION', payload: 1});
		expect(counter).toBe(3);
	});

	it('Should pass the selected state as argument to the callback', () => {
		connect(state => ({
      myFoo: state.foo
    }), newState => {
      expect(newState).toEqual({myFoo: 'bar'});
    });
	});

	it('Should allow multiple store slices to be selected', () => {
		connect(state => ({
			foo: state.foo,
			anotherState: state.anotherState
    }), ({foo, anotherState}) => {
		 	expect(foo).toBe('bar');
		 	expect(anotherState).toBe(12);
		});
	});

	it('Should return an unsubscribing function', () => {
		let counter = 0;
		let callback = () => counter++;
		let unsubscribe = connect(state => state, callback);
		store.dispatch({type: 'ACTION', payload: 0});
		unsubscribe();
		store.dispatch({type: 'ACTION', payload: 2});
		expect(counter).toBe(2);
	});
});
