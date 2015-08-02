export default function ngReduxProvider() {
  let reduxStoreInstance = undefined;
  this.setReduxStore = store => reduxStoreInstance = store;
  this.$get = () => new NgRedux(reduxStoreInstance);
}

class NgRedux {
  constructor(store){
    this.reduxStore = store;
  }

  getStore() {
    return this.reduxStore;
  }
}