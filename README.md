# ng-redux
###### Angular bindings for [Redux](https://github.com/gaearon/redux).

For Angular 2 see [ng2-redux](https://github.com/wbuchwalter/ng2-redux).

**Warning: The API will be subject to breaking changes until `1.0.0` is released.**

[![build status](https://img.shields.io/travis/wbuchwalter/ng-redux/master.svg?style=flat-square)](https://travis-ci.org/wbuchwalter/ng-redux)
[![npm version](https://img.shields.io/npm/v/ng-redux.svg?style=flat-square)](https://www.npmjs.com/package/ng-redux)


*ngRedux lets you easily connect your angular components with Redux.*


## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API](#api)
- [Using DevTools](#using-devtools)

## Installation

**The current npm version is outdated, and will be updated once 1.0.0 is finished**
```js
npm install --save ng-redux
```

## Quick Start

#### Initialization

```JS
import reducers from './reducers';
import { combineReducers } from 'redux';
import loggingMiddleware from './loggingMiddleware';
import 'ng-redux';

angular.module('app', ['ngRedux'])
.config(($ngReduxProvider) => {
    let reducer = combineReducers(reducers);
    $ngReduxProvider.createStoreWith(reducer, ['promiseMiddleware', loggingMiddleware]);
  });
```

#### Usage
*Note: this sample is using the ControllerAs syntax, usage is slightly different without ControllerAs, see API section for more details*

```JS
import * as CounterActions from '../actions/counter';

class CounterController {
  constructor($ngRedux, $scope) {
    /* ngRedux will merge the requested state's slice and actions onto the $scope, 
    you don't need to redefine them in your controller */
    
    $ngRedux.connect($scope, this.mapStateToScope, CounterActions, 'vm');
  }

  // Which part of the Redux global state does our component want to receive on $scope?
  mapStateToScope(state) {
    return {
      counter: state.counter
    };
  }
}
```

```HTML
<div>
    <p>Clicked: {{vm.counter}} times </p>
    <button ng-click='vm.increment()'>+</button>
    <button ng-click='vm.decrement()'>-</button>
    <button ng-click='vm.incrementIfOdd()'>Increment if odd</button>
    <button ng-click='vm.incrementAsync()'>Increment Async</button>
</div>
```

## API

### `createStoreWith([reducer], [middlewares], [storeEnhancers])`

Creates the Redux store, and allow `connect()` to access it.

#### Arguments: 
* [`reducer`] \(*Function*): A single reducer composed of all other reducers (create with redux.combineReducer)
* [`middlewares`] \(*Function[]*): Optional, An array containing all the middleware that should be applied. Functions and strings are both valid members. String will be resolved via Angular, allowing you to use dependency injection in your middlewares.
* [`storeEnhancers`] \(*Function[]*): Optional, this will be used to create the store, in most cases you don't need to pass anything, see [Store Enhancer official documentation.](http://rackt.github.io/redux/docs/Glossary.html#store-enhancer)


### `connect([scope], [mapStateToScope], [mapDispatchToScope], [propertyKey])`

Connects an Angular component to Redux.

#### Arguments
* [`scope`] \(*Object*): The `$scope` of your controller.
* [`mapStateToScope`] \(*Function*): connect will subscribe to Redux store updates. Any time it updates, mapStateToTarget will be called. Its result must be a plain object, and it will be merged into `target`.
* [`mapDispatchToScope`] \(*Object* or *Function*): If an object is passed, each function inside it will be assumed to be a Redux action creator. An object with the same function names, but bound to a Redux store, will be merged into your component `$scope`. If a function is passed, it will be given `dispatch`. It’s up to you to return an object that somehow uses `dispatch` to bind action creators in your own way. (Tip: you may use the [`bindActionCreators()`](http://gaearon.github.io/redux/docs/api/bindActionCreators.html) helper from Redux.).
* [`propertyKey`] \(*string*): If provided, `mapStateToScope` and `mapDispatchToScope` will merge onto `$scope[propertyKey]`. This is needed especially when using the `ControllerAs` syntax: in this case you should provide the same value than the value provided to controllerAs (e.g: `'vm'`). When not using `ControllerAs` syntax, you are free to omit this argument, everything will be merged directly onto `$scope`.

#### Remarks
As `$scope` is passed to `connect`, ngRedux will listen to the `$destroy` event and unsubscribe the change listener itself, you don't need to keep track of your subscribtions.

### Store API
All of redux's store methods (i.e. `dispatch`, `subscribe` and `getState`) are exposed by $ngRedux and can be accessed directly. For example:

```JS
$ngRedux.subscribe(() => {
    let state = $ngRedux.getState();
    //...
})
```

This means that you are free to use Redux basic API in advanced cases where `connect`'s API would not fill your needs.


## Using DevTools
In order to use Redux DevTools with your angular app, you need to install [react](https://www.npmjs.com/package/react), [react-redux](https://www.npmjs.com/package/react-redux) and [redux-devtools](https://www.npmjs.com/package/redux-devtools) as development dependencies.

```JS
[...]
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import React, { Component } from 'react';

angular.module('app', ['ngRedux'])
  .config(($ngReduxProvider) => {
      $ngReduxProvider.createStoreWith(rootReducer, [thunk], [devTools()]);
    })
  .run(($ngRedux, $rootScope) => {
    React.render(
      <App store={ $ngRedux }/>,
      document.getElementById('devTools')
    );
    
    //To reflect state changes when disabling/enabling actions via the monitor
    //there is probably a smarter way to achieve that
    $ngRedux.subscribe(_ => {
        setTimeout($rootScope.$apply, 100);
    });
  });
  
  class App extends Component {
  render() {
    return (
      <div>
        <DebugPanel top right bottom>
          <DevTools store={ this.props.store } monitor = { LogMonitor } />
        </DebugPanel>
      </div>
    );
  }
}
```

```HTML
<body>
    <div ng-app='app'>
      [...]
    </div>
    <div id="devTools"></div>
</body>
```
