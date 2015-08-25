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
    this.counter = 0;
    $ngRedux.connect(state => ({
      counter: state.counter
    }),
    ({counter}) => this.counter = counter);

    let {increment, decrement, incrementIfOdd} = bindActionCreators(CounterActions, $ngRedux.dispatch);
    this.increment = increment;
    this.decrement = decrement;
    this.incrementIfOdd = incrementIfOdd;
  }
}