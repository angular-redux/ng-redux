export default function digestMiddleware($rootScope) {
  return store => next => action => {
      const res = next(action);
      $rootScope.$evalAsync(res);
      return res;
  };
}
