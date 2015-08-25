import * as CounterActions from '../actions/counter';
import { bindActionCreators } from 'redux';

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

  constructor($ngRedux) {
    $ngRedux.connect(state => ({counter: state.counter}), this);

    let {increment, decrement, incrementIfOdd, incrementAsync} = bindActionCreators(CounterActions, $ngRedux.dispatch);
    this.increment = increment;
    this.decrement = decrement;
    this.incrementIfOdd = incrementIfOdd;
    this.incrementAsync = incrementAsync;
  }

}