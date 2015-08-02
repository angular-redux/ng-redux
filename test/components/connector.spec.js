import expect from 'expect';
import {createStore} from 'redux';
import {Connector} from '../../src/components/connector';

describe('Connector', () => {
	let store;
	let ngRedux;
	beforeEach(() => {
		store = createStore((state, action) => {
			return {foo: 'bar', baz: action.payload};
		});
		ngRedux = {
			getStore: () => store
		};
	});

	it('Should throw when not passed a function as callback', () => {
		let connector = new Connector(ngRedux, state => state, {});
		expect(() => store.dispatch({type: 'ACTION', payload: 0})).toThrow();
	});

	it('Should throw when not passed a function as selector', () => {
		expect(() => new Connector(ngRedux, {}, props)).toThrow();
	});

	it('Should call the function passed to connect when the store updates', () => {
		let counter = 0;
		let callback = () => counter++;
		let connector = new Connector(ngRedux, state => state, callback);
		store.dispatch({type: 'ACTION', payload: 0});
		store.dispatch({type: 'ACTION', payload: 1});
		store.dispatch({type: 'ACTION', payload: 2});
		expect(counter).toBe(3);
	});

	it('Should prevent unnecessary updates when state does not change', () => {
		let counter = 0;
		let callback = () => counter++;
		let connector = new Connector(ngRedux, state => state, callback);
		store.dispatch({type: 'ACTION', payload: 0});
		store.dispatch({type: 'ACTION', payload: 0});
		store.dispatch({type: 'ACTION', payload: 0});
		expect(counter).toBe(1);
	});

	it('Should pass the selected state as argument to the callback', () => {
		let receivedState;
		let connector = new Connector(ngRedux, state => state.foo, newState => receivedState = newState);
		store.dispatch({type: 'ACTION', payload: 1});
		expect(receivedState).toBe('bar');
	});

	it('Should unsubscribe when disconnect is called', () => {
		let counter = 0;
		let callback = () => counter++;
		let connector = new Connector(ngRedux, state => state, callback);
		store.dispatch({type: 'ACTION', payload: 0});
		connector.unsubscribe();
		store.dispatch({type: 'ACTION', payload: 2});
		expect(counter).toBe(1);
	});
});
