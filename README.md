# ng-redux
Angular bindings for [Redux](https://github.com/gaearon/redux).

## Overview

ngRedux lets you easily connect your angular components with Redux.
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

If you haven't, check out [reselect](https://github.com/faassen/reselect), an awesome tool to create and combine selectors.


This returned object will be passed as single argument to the callback provided whenever the state changes.
ngRedux checks for shallow equality of the state's selected slice whenever the Store is updated, and will call the callback only if there is a change.


## Getting Started

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
    reduxConnector.connect(state => state.todos, todos => this.todos = todos);
  }
  
  [...]
}
```


You can also create multiple connections in single component:

```JS
constructor(reduxConnector) {
    this.todos = [];
    this.users = [];
    reduxConnector.connect(state => state.todos, todos => this.todos = todos);
    reduxConnector.connect(state => state.users, users => this.users = users);
  }
```


#### Unsubscribing

You can close a specific connection like this:

```JS

constructor(reduxConnector) {
    this.todos = [];
    this.users = [];
    this.disconnectTodos = reduxConnector.connect(state => state.todos, todos => this.todos = todos);
    reduxConnector.connect(state => state.users, users => this.users = users);
  }
  
disconnectSome() {
    this.disconnectTodos();
}

```


### Accessing Redux' Store
You don't need to create another service to get hold of Redux's store (although you can).
You can access the store via ```$ngRedux.getStore()```:

```JS 
redux.bindActionCreators(actionCreator, $ngRedux.getStore().dispatch);
```


### Example:
An example can be found here (in TypeScript): [tsRedux](https://github.com/wbuchwalter/tsRedux/blob/master/src/components/regionLister.ts).

