# ng-redux
###### Angular bindings for [Redux](https://github.com/gaearon/redux).

For Angular 2 see [ng2-redux](https://github.com/wbuchwalter/ng2-redux).

**Warning: The API is unstable and subject to breaking changes untile `1.0.0` is released.**

[![build status](https://img.shields.io/travis/wbuchwalter/ng-redux/master.svg?style=flat-square)](https://travis-ci.org/wbuchwalter/ng-redux)
[![npm version](https://img.shields.io/npm/v/ng-redux.svg?style=flat-square)](https://www.npmjs.com/package/ng-redux)


*ngRedux lets you easily connect your angular components with Redux.*


## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API](#api)

## Installation
```js
npm install --save ng-redux
```

## Quick Start

#### Initialization

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
    template: "<div ng-repeat='todo in vm.todos'>{{todo.text}}</div>"
  };
}

class TodoLoaderController {
  constructor($ngRedux) {
    $ngRedux.connect(state => ({todos: state.todos}), this);
  }
}
```

## API

### `createStoreWith([reducer], [middlewares], [storeEnhancers])`

Creates the Redux store, and allow `connect()` to access it.

#### Arguments: 
* [`reducer`] \(*Function*): A single reducer composed of all other reducers (create with redux.combineReducer)
* [`middlewares`] \(*Function[]*): Optional, An array containing all the middleware that should be applied. Functions and strings are both valid members. String will be resolved via Angular, allowing you to use dependency injection in your middlewares.
* [`storeEnhancers`] \(*Function[]*): Optional, this will be used to create the store, in most cases you don't need to pass anything, see [Store Enhancer official documentation.](http://rackt.github.io/redux/docs/Glossary.html#store-enhancer)


### `connect([mapStateToTarget], [target])`

Connects an Angular component to Redux.

#### Arguments
* [`mapStateToTarget`] \(*Function*): connect will subscribe to Redux store updates. Any time it updates, mapStateToTarget will be called. Its result must be a plain object, and it will be merged into `target`.
* [`target`] \(*Object*): A plain object, this will be use as a target by `mapStateToTarget`. Read the Remarks below about the implication of passing `$scope` to `connect`.

#### Returns
(*Function*): A function that unsubscribes the change listener.

#### Remarks
If `$scope` is passed to `connect` as `target`, ngRedux will listen to the `$destroy` event and unsubscribe the change listener when it is triggered, you don't need to keep track of your subscribtions in this case.
If anything else than `$scope` is passed as target, the responsability to unsubscribe correctly is deferred to the user.

## Store API
All of redux's store methods (i.e. `dispatch`, `subscribe` and `getState`) are exposed by $ngRedux and can be accessed directly. For example:

```JS
redux.bindActionCreators(actionCreator, $ngRedux.dispatch);
```
