import connectorFactory from './connector';

export default angular.module('ngRedux', [])
  .factory('reduxConnector', connectorFactory);