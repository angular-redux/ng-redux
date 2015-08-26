import expect from 'expect';
import {createStore} from 'redux';
import Connector from '../../src/components/connector';

describe('Connector', () => {
	let store;
	let connect;
	let scopeStub;

	beforeEach(() => {
		store = createStore((state, action) => ({
	      foo: 'bar',
	      baz: action.payload,
	      anotherState: 12,
	      childObject: {child: true}
		}));
		scopeStub = { $on: () => {}, $destroy: () => {}};
		connect = Connector(store);
	});

	it('Should throw when not passed a $scope object as target', () => {
		expect(connect.bind(connect, () => ({}), () => {})).toThrow();
		expect(connect.bind(connect, () => ({}), 15)).toThrow();
		expect(connect.bind(connect, () => ({}), undefined)).toThrow();
		expect(connect.bind(connect, () => ({}), {})).toThrow();

		expect(connect.bind(connect, () => ({}), scopeStub)).toNotThrow();
	});

	it('Should throw when selector does not return a plain object as target', () => {
		expect(connect.bind(connect, state => state.foo, scopeStub)).toThrow();
	});

	it('target should be extended with state once directly after creation', () => {
		connect(() => ({vm : {test: 1}}), scopeStub);
		expect(scopeStub.vm).toEqual({test: 1});
	});

	it('Should update the target passed to connect when the store updates', () => {
		connect(state => state, scopeStub);
		store.dispatch({type: 'ACTION', payload: 0});
		expect(scopeStub.baz).toBe(0);
		store.dispatch({type: 'ACTION', payload: 1});
		expect(scopeStub.baz).toBe(1);
	});

		//does that still makes sense?
	 /*it('Should prevent unnecessary updates when state does not change (shallowly)', () => {
		let counter = 0;
		let callback = () => counter++;
		connect(state => ({baz: state.baz}), callback);
		store.dispatch({type: 'ACTION', payload: 0});
		store.dispatch({type: 'ACTION', payload: 0});
		store.dispatch({type: 'ACTION', payload: 1});
		expect(counter).toBe(3);
	});*/
});
