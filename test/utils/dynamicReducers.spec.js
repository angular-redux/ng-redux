import expect from 'expect';
import { addReducer, removeReducer } from '../../src/utils/dynamicReducers';

describe('Utils', () => {
  describe('dynamicReducers', () => {
    it('returns a function that adds a new async reducer', () => {

      const fakeStore = {
          asyncReducers: {},
          fixedReducers: {},
          replaceReducer: (newReducer) => {
            return newReducer;
          }
      };

      const result = addReducer(fakeStore);
      expect(result).toBeA(Function);
      expect(() => result('test', { actionHandler: () => { console.log('hi'); }})).toBeA(Function);
      expect(Object.keys(fakeStore.asyncReducers).length).toEqual(0);
      result('test', { actionHandler: () => { console.log('hi'); }});
      expect(Object.keys(fakeStore.asyncReducers).length).toEqual(1);
    });

    it('returns a function that removes an existing async reducer', () => {

      const fakeStore = {
          asyncReducers: { test: 'a test' },
          fixedReducers: {},
          replaceReducer: (newReducer) => {
            return newReducer;
          }
      };

      const result = removeReducer(fakeStore);
      expect(result).toBeA(Function);
      expect(() => result('test')).toBeA(Function);
      expect(Object.keys(fakeStore.asyncReducers).length).toEqual(1);
      result('fail');
      expect(Object.keys(fakeStore.asyncReducers).length).toEqual(1);
      result('test');
      expect(Object.keys(fakeStore.asyncReducers).length).toEqual(0);
    });
  });
});
