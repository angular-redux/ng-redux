# ng-redux
###### Angular bindings for [Redux](https://github.com/gaearon/redux).

For Angular 2 see [ng2-redux](https://github.com/wbuchwalter/ng2-redux).

#####Warning: The API is unstable and subject to breaking changes.

[![build status](https://img.shields.io/travis/wbuchwalter/ng-redux/master.svg?style=flat-square)](https://travis-ci.org/wbuchwalter/ng-redux)
[![npm version](https://img.shields.io/npm/v/ng-redux.svg?style=flat-square)](https://www.npmjs.com/package/ng-redux)

## Installation
```js
npm install --save ng-redux
```

## Overview

ngRedux lets you easily connect your angular components with Redux.
the API is straightforward: 

```JS
$ngRedux.connect(selector, callback, disableCaching = false);
```

Where `selector` is a function that takes Redux's entire store state as argument and returns an object that contains the slices of store state that your component is interested in.
e.g:
```JS
state => ({todos: state.todos})
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

```JS
$ngReduxProvider.createStoreWith(reducer, [middlewares], storeEnhancer);
```
#### Parameters: 
* reducer (Function): A single reducer composed of all other reducers (create with redux.combineReducer)
* [middleware] (Array of Function or String): An array containing all the middleware that should be applied. Functions and strings are both valid members. String will be resolved via Angular, allowing you to use dependency injection in your middlewares.
* storeEnhancer: Optional function that will be used to create the store, in most cases you don't need that, see [Store Enhancer official doc](http://rackt.github.io/redux/docs/Glossary.html#store-enhancer)

```JS
import reducers from './reducers';
import {combineReducers} from 'redux';
import loggingMiddleware from './loggingMiddleware';
import 'ng-redux';

angular.module('app', ['ngRedux'])
.config(($ngReduxProvider) => {
    let reducer = combineReducers(reducers);
    $ngReduxProvider.createStoreWith(reducer, ['promiseMiddleware', loggingMiddleware]);
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
    $ngRedux.connect(state => ({todos: state.todos}), ({todos}) => this.todos = todos);
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
    $ngRedux.connect(state => ({
        todos: state.todos,
        users: state.users
    }),
    ({todos, users}) => { 
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
    this.unsubscribe = reduxConnector.connect(state => ({todos: state.todos}), ({todos}) => this.todos = todos);
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
reduxConnector.connect(state => ({todos: state.todos}), ({todos}) => this.todos = todos, true);
```


### Example:
An example can be found here (in TypeScript): [tsRedux](https://github.com/wbuchwalter/tsRedux/blob/master/src/components/regionLister.ts).
