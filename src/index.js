import connectorFactory from './connector';
import ngReduxProvider from './provider';

export default angular.module('ngRedux', [])
  .provider('$ngRedux', ngReduxProvider)
  .factory('reduxConnector', ['$ngRedux', connectorFactory]);