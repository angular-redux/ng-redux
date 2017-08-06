import { createSelector } from 'reselect'

function getPostsState(state) {
    return state.postsByReddit.get(state.selectedReddit);
}

const getPostList = createSelector(
  [getPostsState],
  (postsState) => {
    return postsState && postsState.get('items');
  }
);

export const getPostsTojs = createSelector(
  [getPostList],
  (postList) => {
    return (postList && postList.toJS()) || [];
  }
);

export const getIsFetching = createSelector(
  [getPostsState],
  (postsState) => {
    return postsState && postsState.get('isFetching')
  }
);
