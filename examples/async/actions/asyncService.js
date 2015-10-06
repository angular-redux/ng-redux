import * as types from '../constants/ActionTypes';

function selectReddit(reddit) {
  return {
    type: types.SELECT_REDDIT,
    reddit
  };
}

function invalidateReddit(reddit) {
  return {
    type: types.INVALIDATE_REDDIT,
    reddit
  };
}

function requestPosts(reddit) {
  return {
    type: types.REQUEST_POSTS,
    reddit
  };
}

function receivePosts(reddit, json) {
  return {
    type: types.RECEIVE_POSTS,
    reddit: reddit,
    posts: json.data.children.map(child => child.data),
    receivedAt: Date.now()
  };
}

export default function asyncService($http) {
  function fetchPosts(reddit) {
    return dispatch => {
      dispatch(requestPosts(reddit));
      return $http.get(`http://www.reddit.com/r/${reddit}.json`)
        .then(response => response.data)
        .then(json => dispatch(receivePosts(reddit, json)));
    };
  }

  function shouldFetchPosts(state, reddit) {
    const posts = state.postsByReddit[reddit];
    if (!posts) {
      return true;
    }
    if (posts.isFetching) {
      return false;
    }
    return posts.didInvalidate;
  }

  function fetchPostsIfNeeded(reddit) {
    return (dispatch, getState) => {
      if (shouldFetchPosts(getState(), reddit)) {
        return dispatch(fetchPosts(reddit));
      }
    };
  }

  return {
    selectReddit,
    invalidateReddit,
    fetchPostsIfNeeded
  };
}
