import { getPostsTojs, getIsFetching } from '../selectors'

export default function app() {
  return {
    restrict: 'E',
    controllerAs: 'app',
    controller: AppController,
    template: require('./app.html'),
    scope: {}
  };
}

class AppController {

  constructor($ngRedux, AsyncActions, $scope) {
    const unsubscribe = $ngRedux.connect(this.mapStateToThis, AsyncActions)((selectedState, actions) => {
      this.componentWillReceiveStateAndActions(selectedState, actions);
      Object.assign(this, selectedState, actions);
    });
    this.options = ['angularjs', 'frontend'];
    this.handleChange = this.handleChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);

    this.fetchPostsIfNeeded(this.selectedReddit);
    $scope.$on('$destroy', unsubscribe);
  }

  componentWillReceiveStateAndActions(nextState, nextActions) {
    if (nextState.selectedReddit !== this.selectedReddit) {
      nextActions.fetchPostsIfNeeded(nextState.selectedReddit);
    }
  }

  handleChange(nextReddit) {
    this.selectReddit(nextReddit);
  }

  handleRefreshClick() {
    this.invalidateReddit(this.selectedReddit);
    this.fetchPostsIfNeeded(this.selectedReddit);
  }

  mapStateToThis(state) {
    const { selectedReddit, postsByReddit } = state;

    return {
      selectedReddit,
      // Use selectors here
      posts: getPostsTojs(state),
      isFetching: getIsFetching(state),
      // Or get value from the state directly without selectors
      lastUpdated: postsByReddit.get(selectedReddit) && postsByReddit.get(selectedReddit).get('lastUpdated')
    };
  }
}
