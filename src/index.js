import connectorFactory from './components/connector';
import ngReduxProvider from './components/provider';

export default angular.module('ngRedux', [])
  .provider('$ngRedux', ngReduxProvider)
  .factory('reduxConnector', ['$ngRedux', '$rootScope', connectorFactory])
  .name;