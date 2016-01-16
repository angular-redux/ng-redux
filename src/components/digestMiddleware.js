export default function digestMiddleware($rootScope) {
  return store => next => action => {
      $rootScope.$evalAsync(next(action));
  };
}
