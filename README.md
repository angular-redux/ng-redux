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
- [Dependency Injectable Middleware](#dependency-injectable-middleware)
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

You can either pass a function or an object to `createStoreWith`, or load your reducers in a dynamic way.

With a function:

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

With an object:

```JS
import reducers from './reducers';
import { combineReducers } from 'redux';
import loggingMiddleware from './loggingMiddleware';
import ngRedux from 'ng-redux';
import reducer3 from './reducer3';

angular.module('app', [ngRedux])
.config(($ngReduxProvider) => {
	reducer3 = function(state, action){}
    $ngReduxProvider.createStoreWith({
		reducer1: "reducer1",
		reducer2: function(state, action){},
		reducer3: reducer3
	 }, ['promiseMiddleware', loggingMiddleware]);
  });
```
In this example `reducer1` will be resolved using angular's DI after the config phase.

Dynamic load:

_children component 1:_
```JS
import reducer2 from './reducer2';
import reducer3 from './reducer3';
import ngRedux from 'ng-redux';

angular.module('app.Child1', [ngRedux])
.config(($ngReduxProvider) => {
	
  $ngReduxProvider.injectReducers({
    reducer1: "reducer1",
    reducer2: reducer2
  });

  $ngReduxProvider.injectReducers({
    reducer3: reducer3
  });
});
```

_children component 2:_
```JS
import reducer4 from './reducer4';
import ngRedux from 'ng-redux';

angular.module('app.Child2', [ngRedux])
.config(($ngReduxProvider) => {
  $ngReduxProvider.injectReducers({
    reducer4: reducer4
  });
});
```

_Root Component:_
```JS
import reducer4 from './reducer4';
import ngRedux from 'ng-redux';

import child1 from './component/child1';
import child2 from './component/child2';

angular.module('app', [ngRedux, child1, child2])
.config(($ngReduxProvider) => {
  $ngReduxProvider.createStoreWithInjected(['promiseMiddleware', loggingMiddleware]);
});
```

Because in this dependency tree the `app` component is the last `.config` that ran, `createStoreWithInjected` will create the store with all the dynamic reducers loaded

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

### `createStoreWith(reducer, [middlewares], [storeEnhancers], [initialState])`

Creates the Redux store, and allow `connect()` to access it.

#### Arguments: 
* `reducer` \(*Function*): A single reducer composed of all other reducers (create with redux.combineReducer)
* [`middlewares`] \(*Function[]*): Optional, An array containing all the middleware that should be applied. Functions and strings are both valid members. String will be resolved via Angular, allowing you to use dependency injection in your middlewares.
* [`storeEnhancers`] \(*Function[]*): Optional, this will be used to create the store, in most cases you don't need to pass anything, see [Store Enhancer official documentation.](http://rackt.github.io/redux/docs/Glossary.html#store-enhancer)
* [`initialState`] \(*Object*): Optional, the initial state of your Redux store.

### `injectReducers(reducers)`

Inject Reducers into the dynamic load.

#### Arguments: 
* `reducers` \(*Object*): Object with name and reducer, in the same way that `redux.combineReducer` accepts.

### `createStoreWithInjected(middlewares, storeEnhancers, initialState)`

Creates the redux store, with the combined reducers loaded with `injectReducers`.

#### Arguments: 
* [`middlewares`] \(*Function[]*): Optional, An array containing all the middleware that should be applied. Functions and strings are both valid members. String will be resolved via Angular, allowing you to use dependency injection in your middlewares.
* [`storeEnhancers`] \(*Function[]*): Optional, this will be used to create the store, in most cases you don't need to pass anything, see [Store Enhancer official documentation.](http://rackt.github.io/redux/docs/Glossary.html#store-enhancer)
* [`initialState`] \(*Object*): Optional, the initial state of your Redux store.


### `connect(mapStateToTarget, [mapDispatchToTarget])(target)`

Connects an Angular component to Redux.

#### Arguments
* `mapStateToTarget` \(*Function*): connect will subscribe to Redux store updates. Any time it updates, mapStateToTarget will be called. Its result must be a plain object or a function returning a plain object, and it will be merged into `target`. If you have a component which simply triggers actions without needing any state you can pass null to `mapStateToTarget`.
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
* The `mapStateToTarget` function takes a single argument of the entire Redux store’s state and returns an object to be passed as props. It is often called a selector. Use reselect to efficiently compose selectors and compute derived data. You can also choose to use per-instance memoization by having a `mapStateToTarget` function returning a function of state, see [Sharing selectors across multiple components](https://github.com/reactjs/reselect#user-content-sharing-selectors-with-props-across-multiple-components)



### Store API
All of redux's store methods (i.e. `dispatch`, `subscribe` and `getState`) are exposed by $ngRedux and can be accessed directly. For example:

```JS
$ngRedux.subscribe(() => {
    let state = $ngRedux.getState();
    //...
})
```

This means that you are free to use Redux basic API in advanced cases where `connect`'s API would not fill your needs.

## Dependency Injectable Middleware
You can use angularjs dependency injection mechanism to resolve dependencies inside a `middleware`.
To do so, define a factory returning a middleware:

```Javascript
function myInjectableMiddleware($http, anotherDependency) {
    return store => next => action => {
        //middleware's code
    }
}

angular.factory('myInjectableMiddleware', myInjectableMiddleware);
```

And simply register your middleware during store creation:

```Javascript
$ngReduxProvider.createStoreWith(reducers, [thunk, 'myInjectableMiddleware']);
```

Middlewares passed as **string** will then be resolved throught angular's injector.

## Routers
See [redux-ui-router](https://github.com/neilff/redux-ui-router) to make ng-redux and UI-Router work together. <br>
See [ng-redux-router](https://github.com/amitport/ng-redux-router) to make ng-redux and angular-route work together.

## Using DevTools
There are two options for using Redux DevTools with your angular app.  The first option is to use the [redux-devtools package] (https://www.npmjs.com/package/redux-devtools), 
and the other option is to use the [Redux DevTools Extension] (https://github.com/zalmoxisus/redux-devtools-extension#usage).  The Redux DevTools Extension does not
require adding the react, react-redux, or redux-devtools packages to your project.

To use the redux-devtools package, you need to install [react](https://www.npmjs.com/package/react), [react-redux](https://www.npmjs.com/package/react-redux) and [redux-devtools](https://www.npmjs.com/package/redux-devtools) as development dependencies.

```JS
[...]
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import React, { Component } from 'react';

angular.module('app', ['ngRedux'])
  .config(($ngReduxProvider) => {
      $ngReduxProvider.createStoreWith(rootReducer, [thunk], [devTools()]);
    })
  .run(($ngRedux, $rootScope, $timeout) => {
    React.render(
      <App store={ $ngRedux }/>,
      document.getElementById('devTools')
    );
    
    //To reflect state changes when disabling/enabling actions via the monitor
    //there is probably a smarter way to achieve that
    $ngRedux.subscribe(() => {
        $timeout(() => {$rootScope.$apply(() => {})}, 100);
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

To use the Redux DevTools extension, you must first make sure that you have installed the [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension#installation).

```JS
angular.module('app', ['ngRedux'])
  .config(($ngReduxProvider) => {
      $ngReduxProvider.createStoreWith(rootReducer, [thunk], [window.__REDUX_DEVTOOLS_EXTENSION__()]);
    })
  .run(($ngRedux, $rootScope, $timeout) => { 
    //To reflect state changes when disabling/enabling actions via the monitor
    //there is probably a smarter way to achieve that
    $ngRedux.subscribe(() => {
        $timeout(() => {$rootScope.$apply(() => {})}, 100);
    });
  });
```

## Additional Resources
* [Managing state with Redux and Angular](http://blog.rangle.io/managing-state-redux-angular/)
