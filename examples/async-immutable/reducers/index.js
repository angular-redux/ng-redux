import { combineReducers } from 'redux';
import {
  SELECT_REDDIT, INVALIDATE_REDDIT,
  REQUEST_POSTS, RECEIVE_POSTS
} from '../constants/ActionTypes';
import { fromJS } from 'immutable'


function selectedReddit(state = 'angularjs', action) {
  switch (action.type) {
  case SELECT_REDDIT:
    return action.reddit;
  default:
    return state;
  }
}

function posts(state = fromJS({
  isFetching: false,
  didInvalidate: false,
  items: []
}), action) {
  switch (action.type) {
  case INVALIDATE_REDDIT:
    return state.set('didInvalidate', true);
  case REQUEST_POSTS:
    return state.mergeDeep(fromJS({
        isFetching: true,
        didInvalidate: false,
    }));
  case RECEIVE_POSTS:
    var updatedState = state.mergeDeep(fromJS({
      isFetching: false,
      didInvalidate: false,
      items: action.posts,
      lastUpdated: action.receivedAt
    }));
    return updatedState;
  default:
    return state;
  }
}

function postsByReddit(state = fromJS({}), action) {
  switch (action.type) {
  case INVALIDATE_REDDIT:
  case RECEIVE_POSTS:
  case REQUEST_POSTS:
    return state.set(action.reddit, posts(state.get(action.reddit), action));
  default:
    return state;
  }
}

const rootReducer = combineReducers({
  postsByReddit,
  selectedReddit
});

export default rootReducer;
