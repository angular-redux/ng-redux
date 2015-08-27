import expect from 'expect';
import findControllerAsKey from '../../src/utils/findControllerAsKey';

describe('Utils', () => {
  describe('findControllerAsKey', () => {
    it('Should return the property key of the controller', () => {

      let controllerStub = () => {};
      controllerStub.constructor.$inject = ['$scope', '$ngRedux'];

      let propertyKey = findControllerAsKey({
        $apply: () => {},
        $on: () => {},
        $$id: 2,
        vm: controllerStub
      });

      expect(propertyKey).toBe('vm');
    });
  });
});