import expect from 'expect';
import sinon from 'sinon';
import digestMiddleware from '../../src/components/digestMiddleware';


describe('digestMiddleware', () => {

  it('Should debounce the $evalAsync function if debounce is enabled', (done) => {
    const $evalAsync = sinon.spy();
    const $rootScope = {
      $evalAsync,
    };
    const firstAction = 1;
    const secondAction = 2;
    const debounceConfig = {
      wait: 10,
    };
    const next = sinon.spy((action) => (action));
    const middleware = digestMiddleware($rootScope, debounceConfig);
    middleware()(next)(firstAction);
    setTimeout(() => {
      middleware()(next)(secondAction);
    }, 1);
    setTimeout(() => {
      expect($evalAsync.calledOnce).toBe(true);
      expect(next.calledTwice).toBe(true);
      expect(next.firstCall.calledWithExactly(firstAction)).toBe(true);
      expect(next.secondCall.calledWithExactly(secondAction)).toBe(true);
      expect($evalAsync.firstCall.calledWithExactly(secondAction)).toBe(true);
      done();
    }, debounceConfig.wait + 10);

  });

  it('Should not debounce the $evalAsync function if debounce is disabled', () => {
    const disabledDebounceConfigs = [
      null,
      undefined,
      {},
      { wait: 0 },
    ];
    disabledDebounceConfigs.forEach(() => {
      const $evalAsync = sinon.spy();
      const $rootScope = {
        $evalAsync,
      };
      const firstAction = 1;
      const secondAction = 2;
      const debounceConfig = {};

      const next = sinon.spy((action) => (action));
      const middleware = digestMiddleware($rootScope, debounceConfig);
      middleware()(next)(firstAction);
      middleware()(next)(secondAction);
      expect($evalAsync.calledTwice).toBe(true);
      expect(next.calledTwice).toBe(true);
      expect(next.firstCall.calledWithExactly(firstAction)).toBe(true);
      expect(next.secondCall.calledWithExactly(secondAction)).toBe(true);
      expect($evalAsync.firstCall.calledWithExactly(firstAction)).toBe(true);
      expect($evalAsync.secondCall.calledWithExactly(secondAction)).toBe(true);
    });
  });

});
