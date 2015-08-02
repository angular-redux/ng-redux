# ng-redux
Angular bindings for [Redux](https://github.com/gaearon/redux).

ng-redux lets you easily connect your angular components with Redux.
the API is straightforward:

```JS
reduxConnector.connect(selector, callback);
```

Where selector is a function taking for single argument the entire redux Store's state (a plain JS object) and returns another object, which is the part of the state that your component is interested in.
e.g:
```JS
state => state.todos
```
Note: if you are not familiar with this syntax, go and check out the [MDN Guide on fat arrow  functions (ES2015)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)


This returned object will be passed as single argument to the callback provided.


#### Initialization
You need to pass Redux Store to ng-redux via ```$ngReduxProvider``` :

```JS
import reducers from './reducers';
require('ng-redux');

angular.module('app', ['ngRedux'])
.config(($ngReduxProvider) => {
    let reducer = redux.combineReducers(reducers);
    let store = redux.createStore(reducer);  
    $ngReduxProvider.setReduxStore(store);
  });
``` 

### Usage
```JS
 export default function todoLoader() {
  return {
    controllerAs: 'vm',
    controller: TodoLoaderController,
    template: "<div ng-repeat='todo in vm.todos'>{{todo.text}}</div>",
    
    [...]
  };
}

class TodoLoaderController {    

  constructor(reduxConnector) {
    this.todos = [];
    reduxConnector.connect(todos => todos, todos => this.todos = todos);
  }
  
  [...]
}
```
```todos => this.todos = todos``` is just a shorthand for 
```function(todos) { this.todos = todos }```
using [ES2015 fat arrow syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), so you can pass any function you like as callback, it will be called everytime the particular state you selected has changed.


#### Unsubscribing
```JS
    reduxConnector.disconnect(); 
```

### Accessing Redux' Store
You can access the store via ```$ngRedux.getStore()```

```JS 
redux.bindActionCreators(actionCreator, $ngRedux.getStore().dispatch);
```


### Example:
An example can be found here (in TypeScript): [tsRedux](https://github.com/wbuchwalter/tsRedux/blob/master/src/components/regionLister.ts).

