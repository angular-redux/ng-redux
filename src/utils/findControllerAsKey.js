import _ from 'lodash';

export default function findControllerAsKey(scope) {
  let propertyKey;
  _.forOwn(scope, (v, k) => {
    if (scope[k] && scope[k].constructor && scope[k].constructor.$inject) {
      propertyKey = k;
    }
  });
  return propertyKey;
}
