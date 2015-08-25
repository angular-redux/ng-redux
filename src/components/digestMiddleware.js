export default function digestMiddleware($rootScope) {
  return store => next => action => {
    if(!$rootScope.$$phase) {
      $rootScope.$apply(next(action));
    } else {
      next(action);
    }
  };
}
