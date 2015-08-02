import expect from 'expect';
import isFunction from '../../src/utils/isFunction';

describe('isFunction', () => {
	it('should return true only if function', () => {
		expect(isFunction('')).toBe(false);
		expect(isFunction(undefined)).toBe(false);
		expect(isFunction(null)).toBe(false);
		expect(isFunction()).toBe(false);
		expect(isFunction({a: 1})).toBe(false);

		expect(isFunction(() => {})).toBe(true);
	})
});