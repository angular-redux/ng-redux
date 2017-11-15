let toRun;

export default function digestMiddleware($rootScope, debounceConfig) {
  return store => next => action => {
    const res = next(action);
    if(debounceConfig && debounceConfig.wait && debounceConfig.wait > 0) {
      toRun = res;
      window.setTimeout(() => {
        $rootScope.$evalAsync(toRun);
        toRun = undefined;
      }, debounceConfig.wait);
    } else {
      $rootScope.$evalAsync(toRun);
    }
    return res;
  };
}
