import Connector from './connector';

export default function ngReduxProvider() {
  let reduxStore = undefined;
  this.setReduxStore = store => reduxStore = store;

  this.$get = () => {
    return Connector(reduxStore);
  }
}

