import ngReduxProvider from './components/ngRedux';

export default angular.module('ngRedux', [])
  .provider('$ngRedux', ngReduxProvider)
  .name;