import * as CounterActions from '../actions/counter';

export default function counter() {
  return {
    restrict: 'E',
    controllerAs: 'vm',
    controller: CounterController,
    template: require('./counter.html'),
    scope: {}
  };
}

class CounterController {

  constructor($ngRedux, $scope) {
    $ngRedux.connect($scope, this.mapStateToScope, CounterActions, 'vm');
  }

  // Which part of the Redux global state does our component want to receive on $scope?
  mapStateToScope(state) {
    return {
      counter: state.counter
    };
  }
}