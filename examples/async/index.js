import 'babel-core/polyfill';
import angular from 'angular';
import ngRedux from 'ng-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import rootReducer from './reducers';
import app from './containers/app';
import picker from './components/picker';
import posts from './components/posts';

angular.module('async', [ngRedux])
  .config(($ngReduxProvider) => {
    $ngReduxProvider.createStoreWith(rootReducer, [thunk, createLogger()]);
  })
  .directive('ngrAsync', app)
  .directive('ngrPicker', picker)
  .directive('ngrPosts', posts);
