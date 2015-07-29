# ng-redux
Angular bindings for [Redux](https://github.com/gaearon/redux).
This a port of [react-redux](https://github.com/gaearon/react-redux).

### How to use:
An example can be found here (in TypeScript): [tsRedux](https://github.com/wbuchwalter/tsRedux/blob/master/src/components/regionLister.ts).

```JS
angular.module('app', ['ngRedux'])
.config(($ngReduxProvider) => {
    let reducer = redux.combineReducers(reducers);
    let store = redux.applyMiddleware(promiseMiddleware, loggingMiddleware)(redux.createStore)(reducer);  
    $ngReduxProvider.setReduxStore(store);
  });
``` 

With bindActionCreators:
```JS
redux.bindActionCreators(actionCreator, $ngRedux.getStore().dispatch);
```

In a component:
```JS
 constructor(reduxConnector) {
    reduxConnector.connect(state => state.todos, () => { callback... });
  }
```

