import debounce from 'lodash/debounce';

export default function digestMiddleware($rootScope, debounceConfig) {
  let debouncedFunction = (expr) => {
    $rootScope.$evalAsync(expr);
  };
  if(debounceConfig && debounceConfig.wait && debounceConfig.wait > 0) {
    debouncedFunction = debounce(debouncedFunction, debounceConfig.wait, { maxWait: debounceConfig.maxWait });
  }
  return store => next => action => {
    const res = next(action);
    debouncedFunction(res);
    return res;
  };
}
