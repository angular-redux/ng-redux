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
    const unsubscribe = $ngRedux.connect(this.mapStateToScope, CounterActions)(this);
    $scope.$on('$destroy', unsubscribe);
  }

  // Which part of the Redux global state does our component want to receive on $scope?
  mapStateToScope(state) {
    return {
      counter: state.counter
    };
  }
}