# ng-redux
###### Angular bindings for [Redux](https://github.com/gaearon/redux).

For Angular 2 see [ng2-redux](https://github.com/wbuchwalter/ng2-redux).

#####Warning: The API is unstable and subject to breaking changes until Redux@1.0.0 is released.

[![build status](https://img.shields.io/travis/wbuchwalter/ng-redux/master.svg?style=flat-square)](https://travis-ci.org/wbuchwalter/ng-redux)
[![npm version](https://img.shields.io/npm/v/ng-redux.svg?style=flat-square)](https://www.npmjs.com/package/ng-redux)

## Overview

ngRedux lets you easily connect your angular components with Redux.
the API is straightforward: 

```JS
$ngRedux.connect(selector, callback, disableCaching = false);
//OR
$ngRedux.connect([selector1, selector2, ...], callback, disableCaching = false);
```

Where selector is a function taking for single argument the entire redux Store's state (a plain JS object) and returns another object, which is the slice of the state that your component is interested in.
e.g:
```JS
state => state.todos
```
Note: if you are not familiar with this syntax, go and check out the [MDN Guide on fat arrow  functions (ES2015)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

If you haven't, check out [reselect](https://github.com/faassen/reselect), an awesome tool to create and combine selectors.


This returned object will be passed as argument to the callback provided whenever the state changes.
ngRedux checks for shallow equality of the state's selected slice whenever the Store is updated, and will call the callback only if there is a change.
##### Important: It is assumed that you never mutate your states, if you do mutate them, ng-redux will not execute the callback properly.
See [Redux's doc](http://gaearon.github.io/redux/docs/basics/Reducers.html) to understand why you should not mutate your states.
If you have a good reason to mutate your states, you can still [disable caching](#Disable-caching) altogether.


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

#### Usage
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

  constructor($ngRedux) {
    this.todos = [];
    $ngRedux.connect(state => state.todos, todos => this.todos = todos);
  }

  [...]
}
```

##### Note: The callback provided to ```connect``` will be called once directly after creation to allow initialization of your component states



You can also grab multiple slices of the state by passing an array of selectors:

```JS
constructor(reduxConnector) {
    this.todos = [];
    this.users = [];
    $ngRedux.connect([
    state => state.todos,
    state => state.users
    ],
    (todos, users) => { 
        this.todos = todos
        this.users = users;
    });
  }
```


#### Unsubscribing

You can close a connection like this:

```JS

constructor(reduxConnector) {
    this.todos = [];
    this.unsubscribe = reduxConnector.connect(state => state.todos, todos => this.todos = todos);
  }

destroy() {
    this.unsubscribe();
}

```


#### Accessing Redux' Store
You don't need to create another service to get hold of Redux's store (although you can).
You can access the store via ```$ngRedux.getStore()```:

```JS
redux.bindActionCreators(actionCreator, $ngRedux.getStore().dispatch);
```

#### Disabling caching
Each time Redux's Store update, ng-redux will check if the slices specified via 'selectors' have changed, and if so will execute the provided callback.
You can disable this behaviour, and force the callback to be executed even if the slices didn't change by setting ```disableCaching``` to true:

```JS
reduxConnector.connect(state => state.todos, todos => this.todos = todos, true);
```


### Example:
An example can be found here (in TypeScript): [tsRedux](https://github.com/wbuchwalter/tsRedux/blob/master/src/components/regionLister.ts).
