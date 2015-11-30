# ng-redux
###### Angular bindings for [Redux](https://github.com/gaearon/redux).

For Angular 2 see [ng2-redux](https://github.com/wbuchwalter/ng2-redux).

[![build status](https://img.shields.io/travis/wbuchwalter/ng-redux/master.svg?style=flat-square)](https://travis-ci.org/wbuchwalter/ng-redux)
[![npm version](https://img.shields.io/npm/v/ng-redux.svg?style=flat-square)](https://www.npmjs.com/package/ng-redux)


*ngRedux lets you easily connect your angular components with Redux.*


## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [API](#api)
- [Routers](#routers)
- [Using DevTools](#using-devtools)
- [Additional Resources](#additional-resources)


## Installation
#### npm
```js
npm install --save ng-redux
```
#### bower
```js
bower install --save ng-redux
```

Add the following script tag to your html:

```html
<script src="bower_components/ng-redux/dist/ng-redux.js"></script>
```

## Quick Start

#### Initialization

```JS
import reducers from './reducers';
import { combineReducers } from 'redux';
import loggingMiddleware from './loggingMiddleware';
import ngRedux from 'ng-redux';

angular.module('app', [ngRedux])
.config(($ngReduxProvider) => {
    let reducer = combineReducers(reducers);
    $ngReduxProvider.createStoreWith(reducer, ['promiseMiddleware', loggingMiddleware]);
  });
```

#### Usage

*Using controllerAs syntax*
```JS
import * as CounterActions from '../actions/counter';

class CounterController {
  constructor($ngRedux, $scope) {
    /* ngRedux will merge the requested state's slice and actions onto this, 
    you don't need to redefine them in your controller */
    
    let unsubscribe = $ngRedux.connect(this.mapStateToThis, CounterActions)(this);
    $scope.$on('$destroy', unsubscribe);
  }

  // Which part of the Redux global state does our component want to receive?
  mapStateToThis(state) {
    return {
      value: state.counter
    };
  }
}
```

```HTML
<div>
    <p>Clicked: {{counter.value}} times </p>
    <button ng-click='counter.increment()'>+</button>
    <button ng-click='counter.decrement()'>-</button>
    <button ng-click='counter.incrementIfOdd()'>Increment if odd</button>
    <button ng-click='counter.incrementAsync()'>Increment Async</button>
</div>
```

## API

### `createStoreWith(reducer, [middlewares], [storeEnhancers])`

Creates the Redux store, and allow `connect()` to access it.

#### Arguments: 
* `reducer` \(*Function*): A single reducer composed of all other reducers (create with redux.combineReducer)
* [`middlewares`] \(*Function[]*): Optional, An array containing all the middleware that should be applied. Functions and strings are both valid members. String will be resolved via Angular, allowing you to use dependency injection in your middlewares.
* [`storeEnhancers`] \(*Function[]*): Optional, this will be used to create the store, in most cases you don't need to pass anything, see [Store Enhancer official documentation.](http://rackt.github.io/redux/docs/Glossary.html#store-enhancer)


### `connect(mapStateToTarget, [mapDispatchToTarget])(target)`

Connects an Angular component to Redux.

#### Arguments
* `mapStateToTarget` \(*Function*): connect will subscribe to Redux store updates. Any time it updates, mapStateToTarget will be called. Its result must be a plain object, and it will be merged into `target`. If you have a component which simply triggers actions without needing any state you can pass null to `mapStateToTarget`.
* [`mapDispatchToTarget`] \(*Object* or *Function*): Optional. If an object is passed, each function inside it will be assumed to be a Redux action creator. An object with the same function names, but bound to a Redux store, will be merged onto `target`. If a function is passed, it will be given `dispatch`. It’s up to you to return an object that somehow uses `dispatch` to bind action creators in your own way. (Tip: you may use the [`bindActionCreators()`](http://gaearon.github.io/redux/docs/api/bindActionCreators.html) helper from Redux.).

*You then need to invoke the function a second time, with `target` as parameter:*
* `target` \(*Object* or *Function*): If passed an object, the results of `mapStateToTarget` and `mapDispatchToTarget` will be merged onto it. If passed a function, the function will receive the results of `mapStateToTarget` and `mapDispatchToTarget` as parameters.

e.g:
```JS 
connect(this.mapState, this.mapDispatch)(this);
//Or
connect(this.mapState, this.mapDispatch)((selectedState, actions) => {/* ... */});

```
#### Returns
Returns a *Function* allowing to unsubscribe from further store updates.

#### Remarks
* The `mapStateToTarget` function takes a single argument of the entire Redux store’s state and returns an object to be passed as props. It is often called a selector. Use reselect to efficiently compose selectors and compute derived data.



### Store API
All of redux's store methods (i.e. `dispatch`, `subscribe` and `getState`) are exposed by $ngRedux and can be accessed directly. For example:

```JS
$ngRedux.subscribe(() => {
    let state = $ngRedux.getState();
    //...
})
```

This means that you are free to use Redux basic API in advanced cases where `connect`'s API would not fill your needs.


## Routers
See [redux-ui-router](https://github.com/neilff/redux-ui-router) to make ng-redux and UI-Router work together. <br>
See [ng-redux-router](https://github.com/amitport/ng-redux-router) to make ng-redux and angular-route work together.

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

## Additional Resources
* [Managing state with Redux and Angular](http://blog.rangle.io/managing-state-redux-angular/)
