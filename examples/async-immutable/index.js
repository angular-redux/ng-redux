//import 'babel-core/polyfill';
import angular from 'angular';
import ngRedux from 'ng-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from './reducers';
import asyncService from './actions/asyncService';
import app from './containers/app';
import picker from './components/picker';
import posts from './components/posts';

angular.module('async', [ngRedux])
  .config(($ngReduxProvider) => {
    $ngReduxProvider.createStoreWith(rootReducer, [thunk, createLogger()]);
  })
  .service('AsyncActions', asyncService)
  .directive('ngrAsync', app)
  .directive('ngrPicker', picker)
  .directive('ngrPosts', posts);
