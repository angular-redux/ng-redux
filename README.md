# ng-redux
Angular bindings for [Redux](https://github.com/gaearon/redux).
This a port of [react-redux](https://github.com/gaearon/react-redux).

### How to use:
An example can be found here (in TypeScript): [tsRedux](https://github.com/wbuchwalter/tsRedux/blob/master/src/components/regionLister.ts).

```
angular.module('app', ['ngRedux']);

[...]

 constructor(reduxConnector) {
    reduxConnector.connect(state => state.todos, () => { callback... });
  }
```

